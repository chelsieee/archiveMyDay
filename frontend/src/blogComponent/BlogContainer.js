import React, { useEffect, useState } from "react";
import axios from "axios";
import { List } from "./List";
import { AddBlog } from "./AddBlog";
import { EditBlog } from "./EditBlog";
import { PrivateList } from "./PrivateList";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";

export const BlogContainer = (props) => {
  const [blogList, setBlogList] = useState([]);
  const [personalBlogList, setPersonalBlogList] = useState([]);
  const history = useHistory();

  const [editblog, setEditBlog] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);

  const handleNewBlogFormSubmit = (blog) => {
    let payload = {
      title: blog.title,
      content: blog.content,
      category_id: blog.categoryId
    }

    axios
      .post("/api/blogs", payload, {
        "Access-Control-Allow-Credentials": true,
        headers: {
          'token':window.localStorage.getItem('token')
        }
      })
      .then((res) => {
        console.log("post response:", res);
        history.replace("/private");

    axios
      .get("/api/blogs", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
      .then((res) => {
            console.log("blog Data:", res);
            setBlogList(res.data);
          });
      
    axios
          .get("/api/blogs/myblog", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
          .then((res) => {
            console.log("blog Data:", res);
            setPersonalBlogList(res.data);
          });
      });
  };

  const handleBlogClick = (blog) => {
    setEditBlog(blog);
  };

  const handleEditBlog = (blog) => {
    let payload = {
      title: blog.title,
      content: blog.content,
      category_id: blog.categoryId
    }
    axios
      .patch(
        `/api/blogs/${blog.id}`, payload,
        
        { "Access-Control-Allow-Credentials": true,
        headers: {
          'token':window.localStorage.getItem('token')
        } },
       
      )
      .then((res) => {
        console.log("PUT res:", res.data);
        history.replace('/private')
        axios
          .get("/api/blogs", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
          .then((res) => {
            console.log("blog Data:", res);
            setBlogList(res.data);
          });

        axios
          .get("/api/blogs/myblog", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
          .then((res) => {
            console.log("blog Data:", res);
            setPersonalBlogList(res.data);
          });
      })
  
  };

  const handleDeleteBlog = (blog) => {
    console.log("blog to be deleted:", blog.id);
    axios
      .delete(`/api/blogs/${blog.id}`, {
        "Access-Control-Allow-Credentials": true,
        headers: {
          'token':window.localStorage.getItem('token')
        }
      })
      .then((deletedBlog) => {
        console.log(deletedBlog);
        axios
          .get("/api/blogs/myblog", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
          .then((res) => {
            console.log("Personal blog Data:", res);
            setPersonalBlogList(res.data);
          });

        axios
          .get("/api/blogs", {
            "Access-Control-Allow-Credentials": true,
            headers: {
              'token':window.localStorage.getItem('token')
            }
          })
          .then((res) => {
            console.log("blog Data:", res);
            setBlogList(res.data);
          });
      })
  
  };

  useEffect(() => {
    axios
      .get("/api/blogs", {
        "Access-Control-Allow-Credentials": true,
        headers: {
          'token':window.localStorage.getItem('token')
        }
      })
      .then((res) => {
        console.log("blog Data:", res);
        setBlogList(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/blogs/myblog", {
        "Access-Control-Allow-Credentials": true,
        headers: {
          'token':window.localStorage.getItem('token')
        }
      })
      .then((res) => {
        console.log("blog Data:", res);
        setPersonalBlogList(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/categories", {
        "Access-Control-Allow-Credentials": true,
      })
      .then((res) => {
        console.log("categories Data:", res);
        setCategories(res.data);
      });
  }, []);

  return (
    <div>
      <Route exact path="/">
        <List blogs={blogList} />
      </Route>
      <Route path="/private">
        <PrivateList
          blogs={personalBlogList}
          handleClick={handleBlogClick}
          handleDelete={handleDeleteBlog}
          login={props.users}
        />
      </Route>
      <Route path="/blog/add">
        <AddBlog submit={handleNewBlogFormSubmit} categories={categories} />
      </Route>
      <Route path="/blog/edit">
        <EditBlog
          submit={handleEditBlog}
          blog={editblog}
          categories={categories}
        />
      </Route>
    </div>
  );
};
