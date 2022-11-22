import fs from 'fs'
import matter from 'gray-matter';
import path from "path";
import { remark } from 'remark';
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  // 동기식 Sync, 비동기식 async
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '') // pre-rendering.md -> pre-rendering
    const fullPath = path.join(postsDirectory, fileName) // user/moomhyuk/desktop/김문혁/1007~react/projects/app_nextjs_typescript/posts/pre-rendering.md
    const fileContents = fs.readFileSync(fullPath, 'utf-8') // 파일 내용
    const matterResult = matter(fileContents) // 객체 변환

    return {
      id,
      ...(matterResult.data as {date:string; title:string})
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id:string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')
  const matterResult = matter(fileContents) // 객체 변환
  const processedContent = await remark().use(html).process(matterResult.content) // remark는 markdown을 html로 변환
  const contentHtml = processedContent.toString()
  return{
    id,
    contentHtml,
    ...(matterResult.data as {date:string; title:string})
  }
}