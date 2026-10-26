import {createClient} from '@sanity/client'
import {createReadStream} from 'node:fs'
import {readdir} from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline/promises'
import {stdin, stdout} from 'node:process'

const projectId = process.env.SANITY_PROJECT_ID || 'ph340op5'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = '2026-06-28'
const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.tif', 'image/tiff'],
  ['.tiff', 'image/tiff'],
  ['.webp', 'image/webp'],
])
const categories = new Map([
  ['0', '재료'],
  ['1', '요리'],
  ['2', '디자인'],
])

async function findImages(directory) {
  const entries = await readdir(directory, {withFileTypes: true})
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findImages(entryPath)))
    } else if (entry.isFile() && contentTypes.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath)
    }
  }

  return files.sort((first, second) => first.localeCompare(second))
}

async function askCategory(rl) {
  while (true) {
    const answer = (await rl.question('분류 (0=재료, 1=요리, 2=디자인): ')).trim()
    if (categories.has(answer)) return Number(answer)
    console.log('0, 1, 2 중 하나를 입력해주세요.')
  }
}

async function askIngredient(rl, ingredientsByNumber) {
  while (true) {
    const answer = (await rl.question('재료 번호: ')).trim()
    if (!answer) {
      console.log('재료 번호를 입력해주세요.')
      continue
    }

    const number = Number(answer)
    const ingredient = ingredientsByNumber.get(number)

    if (Number.isInteger(number) && ingredient) return ingredient
    console.log('목록에 있는 재료 번호를 입력해주세요.')
  }
}

async function askOptionalUrl(rl) {
  while (true) {
    const answer = (await rl.question('인스타그램 URL (없으면 Enter): ')).trim()
    if (!answer) return undefined

    if (URL.canParse(answer)) {
      const url = new URL(answer)
      if (url.protocol === 'https:' || url.protocol === 'http:') return answer
    }

    console.log('http:// 또는 https:// 로 시작하는 URL을 입력해주세요.')
  }
}

async function promptMetadata(rl, filePath, ingredientsByNumber) {
  const defaultTitle = path.basename(filePath, path.extname(filePath))
  const titleInput = (await rl.question(`제목 [${defaultTitle}]: `)).trim()
  const title = titleInput || defaultTitle
  const ingredient = await askIngredient(rl, ingredientsByNumber)
  const category = await askCategory(rl)
  const istgUrl = await askOptionalUrl(rl)
  const altInput = (await rl.question(`대체 텍스트 [${title}]: `)).trim()
  const alt = altInput || title

  console.log('\n업로드 정보')
  console.log(`  파일: ${path.basename(filePath)}`)
  console.log(`  제목: ${title}`)
  console.log(`  재료: ${ingredient.name} (${ingredient.ingreNum})`)
  console.log(`  분류: ${categories.get(String(category))}`)
  if (istgUrl) console.log(`  인스타그램: ${istgUrl}`)
  console.log(`  대체 텍스트: ${alt}`)

  return {title, ingredient, category, istgUrl, alt}
}

async function main() {
  const directoryArgument = process.argv[2]
  if (!directoryArgument || process.argv.length > 3) {
    throw new Error('사용법: npm run upload:images -- "C:\\path\\to\\images"')
  }

  const directory = path.resolve(directoryArgument)
  const token = process.env.SANITY_API_TOKEN
  if (!token) {
    throw new Error('SANITY_API_TOKEN 환경 변수에 쓰기 권한이 있는 Sanity API 토큰을 설정해주세요.')
  }

  const images = await findImages(directory)
  if (images.length === 0) {
    throw new Error('지원하는 이미지 파일을 찾지 못했습니다 (JPEG, PNG, GIF, WebP, AVIF, TIFF).')
  }

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const ingredients = await client.fetch(
    '*[_type == "ingredient"] | order(ingreNum asc) {_id, ingreNum, name}',
  )
  if (ingredients.length === 0) {
    throw new Error('Sanity에서 ingredient 문서를 찾지 못했습니다. 먼저 재료 문서를 등록해주세요.')
  }

  const ingredientsByNumber = new Map()
  for (const ingredient of ingredients) {
    if (ingredientsByNumber.has(ingredient.ingreNum)) {
      throw new Error(`재료 번호 ${ingredient.ingreNum}가 중복되어 사진 문서를 연결할 수 없습니다.`)
    }
    ingredientsByNumber.set(ingredient.ingreNum, ingredient)
  }

  console.log(`이미지 ${images.length}개를 찾았습니다. 재료 목록:`)
  for (const ingredient of ingredients) {
    console.log(`  ${ingredient.ingreNum}: ${ingredient.name}`)
  }

  const rl = readline.createInterface({input: stdin, output: stdout})
  const uploaded = []
  const skipped = []
  const failed = []

  try {
    for (const [index, filePath] of images.entries()) {
      console.log(`\n[${index + 1}/${images.length}] ${path.relative(directory, filePath)}`)
      const metadata = await promptMetadata(rl, filePath, ingredientsByNumber)
      const confirmation = (await rl.question('업로드할까요? [Y/n]: ')).trim().toLowerCase()
      if (confirmation && confirmation !== 'y' && confirmation !== 'yes') {
        skipped.push(filePath)
        console.log('건너뛰었습니다.')
        continue
      }

      let asset
      try {
        asset = await client.assets.upload('image', createReadStream(filePath), {
          filename: path.basename(filePath),
          contentType: contentTypes.get(path.extname(filePath).toLowerCase()),
        })

        const document = await client.create({
          _type: 'ingrePhotograph',
          title: metadata.title,
          ingreNum: {_type: 'reference', _ref: metadata.ingredient._id},
          image: {
            _type: 'image',
            asset: {_type: 'reference', _ref: asset._id},
            alt: metadata.alt,
          },
          category: metadata.category,
          ...(metadata.istgUrl ? {istgUrl: metadata.istgUrl} : {}),
        })
        uploaded.push({filePath, documentId: document._id})
        console.log(`완료: ${document._id}`)
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        failed.push({filePath, detail, assetId: asset?._id})
        console.error(`실패: ${detail}`)
        if (asset?._id) console.error(`업로드된 에셋 ID (재사용 가능): ${asset._id}`)
      }
    }
  } finally {
    rl.close()
  }

  console.log(`\n결과: 성공 ${uploaded.length}개, 건너뜀 ${skipped.length}개, 실패 ${failed.length}개`)
  if (failed.length > 0) process.exitCode = 1
}

main().catch((error) => {
  const detail = error instanceof Error ? error.message : String(error)
  console.error(`오류: ${detail}`)
  process.exitCode = 1
})
