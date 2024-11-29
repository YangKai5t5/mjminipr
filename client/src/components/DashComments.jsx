import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {" "}
      {currentUser && currentUser.isAdmin && comments.length > 0 ? (
        <>
          {" "}
          <table className="shadow-md w-full">
            {" "}
            <thead>
              {" "}
              <tr>
                {" "}
                <th className="p-2">Date updated</th>{" "}
                <th className="p-2">Comment content</th>{" "}
                <th className="p-2">Number of likes</th>{" "}
                <th className="p-2">PostId</th> <th className="p-2">UserId</th>{" "}
                <th className="p-2">Delete</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {" "}
                  <td className="p-2">
                    {" "}
                    {new Date(comment.updatedAt).toLocaleDateString()}{" "}
                  </td>{" "}
                  <td className="p-2">{comment.content}</td>{" "}
                  <td className="p-2">{comment.numberOfLikes}</td>{" "}
                  <td className="p-2">{comment.postId}</td>{" "}
                  <td className="p-2">{comment.userId}</td>{" "}
                  <td className="p-2">
                    {" "}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      {" "}
                      Delete{" "}
                    </span>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              {" "}
              Show more{" "}
            </button>
          )}{" "}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}{" "}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        {" "}
        <Modal.Header />{" "}
        <Modal.Body>
          {" "}
          <div className="text-center">
            {" "}
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />{" "}
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              {" "}
              Are you sure you want to delete this comment?{" "}
            </h3>{" "}
            <div className="flex justify-center gap-4">
              {" "}
              <Button color="failure" onClick={handleDeleteComment}>
                {" "}
                Yes, I'm sure{" "}
              </Button>{" "}
              <Button color="gray" onClick={() => setShowModal(false)}>
                {" "}
                No, cancel{" "}
              </Button>{" "}
            </div>{" "}
          </div>{" "}
        </Modal.Body>{" "}
      </Modal>{" "}
    </div>
  );
}
