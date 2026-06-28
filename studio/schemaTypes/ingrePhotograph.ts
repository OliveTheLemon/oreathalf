import {defineType, defineField} from 'sanity'

export const ingrePhotograph = defineType({
  name: 'ingrePhotograph',
  title: '재료 관련 사진',
  type: 'document',
  fields: [
    defineField({
      name: 'ingreNum',
      title: '연결된 재료 번호',
      type: 'reference', // 타입은 reference
      to: [{type: 'ingredient'}], // ingredient 스키마를 참조하겠다고 명시!
      validation: (Rule) => Rule.required().error('어떤 재료의 사진인지 선택해주세요.'),
    }),
    defineField({
      name: 'title',
      title: '사진 제목',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: '사진',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '이미지 대체 텍스트 (SEO용)',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '사진 분류 번호',
      type: 'number',
      options: {
        list: [
          {title: '재료', value: 0},
          {title: '요리', value: 1},
          {title: '디자인', value: 2},
        ],
        layout: 'radio', // 관리자 화면에서 라디오 버튼 형태로 예쁘게 선택 가능하게 함
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'istgUrl',
      title: '인스타그램 링크',
      type: 'url',
    }),
  ],
})
