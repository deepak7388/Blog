import React, { useEffect, useState ,useContext} from 'react'
import { useParams,Link, Navigate } from 'react-router-dom';
import '../styles/Blog.css';
import { UserContext } from '../UserContext';
import { format } from 'date-fns';

const Blog = () => {

    const {id}=useParams();

    const [blogInfo,setBlogInfo]=useState(null);
    const {userInfo} = useContext(UserContext);
    const [redirect,setRedirect]=useState(false);
    useEffect(()=>{
        fetch(`http://localhost:4000/blog/${id}`).then((response)=>{
            response.json().then((blog)=>{
                setBlogInfo(blog);
                // console.log("blog",blog);
                // console.log("id",blog.author._id);
                // console.log(userInfo.id);
            })
        }
        )
    },[id])

    async function deleteBlog(){
        // const confirmation=confirm("Are you sure want to delete this Blog???")
        // if(confirmation){
            const response=await fetch('http://localhost:4000/blog/'+id,{method:'DELETE',credentials:'include'}).then((response)=>{
                console.log("Response after deletion",response);
                if(response.ok){
                    setRedirect(true)
                }
                else {
                    response.json().then((msg)=>{
                    console.log("Msg received: ",msg);
                    })
                }
            })
        // }
    }

    if(redirect) return <Navigate to="/"/>;
    if(!blogInfo) return '';
    const newLocal = <div className='buttons'>
    <div className='editBlog'>
        <Link className="edit-btn" to={`/edit/${blogInfo._id}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        <p>Edit Blog</p>
        </Link>
    </div>
    <div className='deleteBlog'>
    <Link className="delete-btn" onClick={deleteBlog}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        <p>Delete Blog</p>
    </Link>
    </div>
    </div>;
   
  return (
    <div>
        <div className="blogTitle">{blogInfo.title}</div>
        <div className='blogDate'>{format(new Date(blogInfo.createdAt),'dd-MM-yyyy, hh:mm a')}</div>
        <div className='blogAuthor'>~{blogInfo.author.username}</div>
        {(userInfo.id===blogInfo.author._id)&& newLocal}
        <img src={`http://localhost:4000/`+blogInfo.cover} alt='Blog'/>
        <div className='blogDescription' dangerouslySetInnerHTML={{__html:blogInfo.description}}/>
    </div>
  )
}

export default Blog;