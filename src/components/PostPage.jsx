import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { editPost } from "../store/postsSlice";
import api from "../api"; // Make sure to import your api instance

const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  async function handleEdit() {
    try {
      await api.put(`/posts/${post.id}`, {
        title,
        body
      });
      dispatch(editPost({ ...post, title, body }));
      setEdit(false);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className='PostPage'>
      <article className='post'>
        {post && (
          <>
            {edit ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
                <div>
                <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea rows={5} name="body" value={body} onChange={e => setBody(e.target.value)}></textarea>
                
              </div>
                <button className="saveBtn" type="submit">Save</button>
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className='postDate'>{post.datetime}</p>
                <p className='body'>{post.body}</p>
              </>
            )}
            <div className='buttons'>
              <button className='danger' onClick={() => handleDelete(post.id)}>
                Delete
              </button>
              <button onClick={() => setEdit(!edit)}>
                {edit ? "Cancel" : "Edit"}
              </button>
              {!edit && (
                <button onClick={() => navigate(-1)}>Back</button>
              )}
            </div>
          </>
        )}
        {!post && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to='/'>Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;





















