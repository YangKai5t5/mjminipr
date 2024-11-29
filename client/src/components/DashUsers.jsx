import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
      {currentUser && currentUser.isAdmin && users.length > 0 ? (
        <>
          {" "}
          <table className="shadow-md w-full">
            {" "}
            <thead>
              {" "}
              <tr>
                {" "}
                <th className="p-2">Date created</th>{" "}
                <th className="p-2">User image</th>{" "}
                <th className="p-2">Username</th> <th className="p-2">Email</th>{" "}
                <th className="p-2">Admin</th> <th className="p-2">Delete</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {" "}
                  <td className="p-2">
                    {" "}
                    {new Date(user.createdAt).toLocaleDateString()}{" "}
                  </td>{" "}
                  <td className="p-2">
                    {" "}
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />{" "}
                  </td>{" "}
                  <td className="p-2">{user.username}</td>{" "}
                  <td className="p-2">{user.email}</td>{" "}
                  <td className="p-2">
                    {" "}
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}{" "}
                  </td>{" "}
                  <td className="p-2">
                    {" "}
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this user?{" "}
            </h3>{" "}
            <div className="flex justify-center gap-4">
              {" "}
              <Button color="failure" onClick={handleDeleteUser}>
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
