import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api";

import { useDispatch, useSelector } from "react-redux";
import { deletePost, addPosts } from "./store/postsSlice";

function App() {
  const posts = useSelector((store) => store.postsReducer.posts);
  console.log({ posts });

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/posts");
        dispatch(addPosts(response.data));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { 
      id: String(id), 
      title: postTitle, 
      datetime, body: 
      postBody };

    try {
      await api.post("/posts", newPost);
      dispatch(addPost(newPost));
    } catch (error) {
      setError(error.message);
    }


    setPostTitle("");
    setPostBody("");
    navigate("/");
  };


  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/posts/${id}`);
      dispatch(deletePost(id));

    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(false);
    }

    navigate("/");
  };

  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav search={search} setSearch={setSearch} />
      {loading && <p>Loading...</p>}
      {/* {error && <p>Error: {error}</p>} */}
      <Routes>
        <Route path='/' element={<Home posts={searchResults} />} />
        <Route
          path='/post'
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path='/post/:id'
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path='/about' component={<About />} />
        <Route path='*' component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
