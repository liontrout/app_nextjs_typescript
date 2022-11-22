import { GetStaticPaths, GetStaticProps } from "next"
import { getAllPostIds, getPostData } from "../../lib/posts"
import homeStyles from '../../styles/Home.module.css'
import Head from 'next/head'

export default function Post({postData}:{
  postData:{
    title: string
    date: string
    contentHtml: string
}}) {
  return (
    <div>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={homeStyles.headingXl}>{postData.title}</h1>
        <div className={homeStyles.lightText}>
          {postData.date}
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  const paths = getAllPostIds()
  console.log('paths', paths)
  return {
    /*
      paths: [
        { params: { id: 'pre-rendering' } },
        { params: { id: 'ssg-ssr' } }
      ]
      fallback: 
        false일 경우: getStaticPaths로 리턴되지 않는 것은 모두 404 페이지가 뜬다.
        true일 경우: 404 페이지가 뜨지 않고 fallback 페이지(내가 만든 페이지)가 뜨게 된다.
    */
    paths,
    fallback: false
  }
}

export const getStaticProps:GetStaticProps = async ({params}) => {
  console.log('params', params);
  // { id: 'ssg-ssr }
  const postData = await getPostData(params?.id as string) // params?.id는 params && id와 같은 형식
  return {
    props: {
      postData
    }
  }
}