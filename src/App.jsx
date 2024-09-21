import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form'

function App() {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {errors,isSubmitting },
  }=useForm()

const [showPostMenu, setshowPostMenu] = useState(false)
const [posts, setPosts] = useState([])
const [currentPost, setCurrentPost] = useState(null);//hold the post being edited
uuidv4();

const delay=(d)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve() 
    },d*1000);
  })
}

const onSubmit =async (data)=>{ 
  await delay(1) //simulating network delay
   const post={
    id:currentPost? currentPost.id: uuidv4(),
    file:data.image[0],
    url:URL.createObjectURL(data.image[0]),
    caption:data.caption
   };
   if(currentPost){
    setPosts(posts.map((item) => (item.id === currentPost.id ? post : item)));
   }
   else{
   setPosts([...posts,post]);
   }
   closeAddBar(); 
   reset();
}

const showAddBar=()=>{
  setshowPostMenu(true);
}

const closeAddBar=()=>{
  setshowPostMenu(false);
  setCurrentPost(null);
  reset();
}

const deletePost=(e,id)=>{
  let remainingPost=posts.filter(item=>item.id!==id);
  setPosts(remainingPost);
}

const editPost=(e,id)=>{
  const post = posts.find((item) => item.id === id);
    setCurrentPost(post);
    setValue('caption', post.caption);
  showAddBar();
}

const PostWindow = ({show,onClose}) => {
  if(!show){
    return null;  
  }
  return (
   <div className="postBox ml-4 bg-slate-400 fixed flex rounded-md justify-center items-center z-30">
   <div className="postMenu m-2 bg-slate-200 p-7 w-80  rounded-md z-40 shadow-lg">
    <form action="" onSubmit={handleSubmit(onSubmit)}>
      <div className='bg-slate-300 rounded-xl p-2 m-1'>
      <label>Add a photo</label>
      <br />
      <input type="file" accept='image/*' name="image" {...register("image",{required:{value:true ,message:"this field is required"}})} />
      {errors.image && <div  className='red'>{errors.image.message}</div> }
      </div>
      <div className='bg-slate-300 rounded-xl p-2 m-1'>
      <label>Add a caption</label>
      <br />
      <input type="text" name="caption" {...register("caption",{required:{value:true ,message:"this field is required"}})}/>
      {errors.caption && <div  className='red'>{errors.caption.message}</div> }
      </div>
      <button className=' bg-green-300 rounded-lg p-1 px-2 ml-1 flex justify-end' type='submit' value="submit" disabled={isSubmitting} >Submit</button>
    </form>
      <button className="close bg-rose-300 rounded-lg px-2 p-1 ml-2 mt-4 float-right " onClick={onClose}>Close</button>
   </div>
   </div>
   
  )
}
  return (
    <>
      <div className="container ">
        <button onClick={showAddBar} className='bg-cyan-300 rounded-lg p-2 m-4'>Add a Post</button>
        <hr />
        <PostWindow show={showPostMenu} onClose={closeAddBar} />
        <div className="post bg-violet-100 h-screen  rounded-md  flex flex-col justify-start items-center p-2">
          {posts.map(item=>{
            return <div key={item.id} className="post m-2 p-3 bg-purple-200 w-4/5 border-purple-300 border-4 ">
              <div className="hero">
              <img src={item.url} className='w-full' alt="" />
                <p className='my-1 p-1 pl-2 bg-purple-100'>{item.caption}</p>
              </div>
              <div className="buttons flex justify-end">
                <button className='bg-pink-300 rounded-lg p-1 px-1 m-1 border-2 border-pink-500' onClick={(e)=>{editPost(e,item.id)}} >edit</button>
                <button className='bg-pink-300 rounded-lg p-1 px-1 m-1 border-2 border-pink-500' onClick={(e)=>{deletePost(e,item.id)}}>delete</button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
