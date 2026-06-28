import {defineType, defineField} from 'sanity'

export const ingredient = defineType({
  name: 'ingredient',
  title: '재료',
  type: 'document',
  fields: [
    defineField({
      name: 'ingreNum',
      title: '재료 번호', // 내가 지정해둔 번호
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: '재료 이름',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
