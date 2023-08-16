import { useCallback, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import styles from "./BoardAdmin.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { ImSearch } from "react-icons/im";
import { HiRefresh } from "react-icons/hi";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import "./Toggle.css";
import { checkModeratorBucketState, getUsers } from '../../network/lib/user';

import { AddUserModal } from './usersModal/AddUserModal';
import { EditUserNameModal } from './usersModal/EditUserNameModal';
import { RemoveUserModal } from './usersModal/RemoveUserModal';

import { AddGroupModal } from './groupsModal/AddGroupModal';
import { EditGroupModal } from './groupsModal/EditGroupModal';
import { EditUsersInGroupModal } from './groupsModal/EditUsersInGroupModal';
import { EditUserPasswordModal } from './usersModal/EditUserPasswordModal';
import { RemoveGroupModal } from './groupsModal/RemoveGroupModal';
 
import { UserList } from './UserList';
import { GroupList } from './GroupList';
import { ErrorHandler } from '../common/ErrorHandler';

import { useQuery } from '@tanstack/react-query';
import { getGroups } from '../../network/lib/group';
import { Link } from 'react-router-dom';
import { FaSortDown } from 'react-icons/fa';
import { LoadingComponent } from '../common/LoadingComponent';
import { useAppStore } from '../../lib/store';

const itemSlide = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const container = {
  visible: {
    opacity: 1, y: "0%",
    transition: {
      duration: 1.5,
      delayChildren: 0.35,
      staggerChildren: 0.15,
      ease: "easeOut",
    }
  },
  hidden: { opacity: 0, y: "5%" },
};

export default function BoardAdmin() {
  const { setSidebarState } = useAppStore();
  useEffect(() => {
    setSidebarState(sidebar => ({ layers: [] }));
  }, [setSidebarState]);

  const [rotatePrev, setRotatePrev] = useState(0);
  const [rotateNext, setRotateNext] = useState(-180);
  const ROTATE_INCREMENT = 180;
  const MAX_ROTATE_VALUE = -1800;
  function rotateInfite() {
    if (isRefresh) {
      setRotatePrev(rotateNext);
      setRotateNext(rotateNext - ROTATE_INCREMENT);
    } else {
      setRotatePrev(rotateNext - ROTATE_INCREMENT);
    }

    if (rotateNext <= MAX_ROTATE_VALUE) {
      setRotatePrev(0);
      setRotateNext(-180);
    }
  }



  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserNameModal, setShowEditUserNameModal] = useState(false);
  const [showEditUserPasswordModal, setShowEditUserPasswordModal] = useState(false);
  const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);

  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showEditUsersInGroupModal, setShowEditUsersInGroupModal] = useState(false);
  const [showRemoveGroupModal, setShowRemoveGroupModal] = useState(false);

  const [isGroup, setIsGroup] = useState(false);


  const [isRefresh, setIsRefresh] = useState(false);
  const [isSearch, setIsSearch] = useState(false);


  const [sortDirectionActiveGroup, setSortDirectionActiveGroup] = useState(1);
  const [sortDirectionActiveUser, setSortDirectionActiveUser] = useState(1);
  const [selectedSortByGroup, setSelectedSortByGroup] = useState(null);
  const [selectedSortByUser, setSelectedSortByUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeIndexGroup, setActiveIndexGroup] = useState(-1);
  const [searchingPhrase, setSearchingPhrase] = useState('');
  const [pageNumberPagin, setPageNumberPagin] = useState(1);
  const [pageNumberGroupPagin, setPageNumberGroupPagin] = useState(1);

  const { data: moderatorChangesPending, isLoading: changesIsLoading, isError: changesIsError, error: changesError } = useQuery(['changes'], () => checkModeratorBucketState())

  const { data: UsersList, isLoading, isError, error, refetch: refetchUsers } = useQuery(['users'], () => getUsers({
    searchPhrase: searchingPhrase,
    pageNumber: pageNumberPagin,
    pageSize: 15,
    sortBy: selectedSortByUser,
    sortDirection: sortDirectionActiveUser,
  }))

  const { data: GroupsList, isLoading2, isError2, error2, refetch: refetchGroups } = useQuery(['groups'], () => getGroups({
    searchPhrase: searchingPhrase,
    pageNumber: pageNumberGroupPagin,
    pageSize: 15,
    sortBy: selectedSortByGroup,
    sortDirection: sortDirectionActiveGroup,
  }))

  useEffect(() => {
    refetchUsers();
    refetchGroups();
  }, [pageNumberPagin, pageNumberGroupPagin, refetchUsers, refetchGroups]);

  const handleChangeSearch = (e) => {
    setSearchingPhrase(e.target.value);
  };

  const submitAdd = useCallback((form) => {
    setActiveIndex(-1);
  }, [])

  const submitEdit = useCallback((form) => {
    setActiveIndex(-1);
  }, [])




  const handleSetLoadMore = (e) => {
    if (isGroup) {
      const selectedValue = e
      setPageNumberGroupPagin(selectedValue + 1);
      setActiveIndex(-1);
      refetchGroups();
    }
    else {
      const selectedValue = e
      setPageNumberPagin(selectedValue + 1);
      setActiveIndex(-1);
      refetchUsers();

    }

  };
  useEffect(() => {
    //refetchUsers();
    //refetchGroups();
  }, [pageNumberPagin, pageNumberGroupPagin]);

  const handleSetLoadPrev = (e) => {
    if (isGroup) {
      const selectedValue = e
      setPageNumberPagin(selectedValue - 1);
      setActiveIndex(-1);
      refetchGroups();
    }
    else {
      const selectedValue = e
      setPageNumberPagin(selectedValue - 1);
      setActiveIndex(-1);
      refetchUsers();
    }

  };

  const handleChangeSortBy = (e) => {
    const selectedValue = e.target.value;
    //Zobaczyć jakie value musi być zwracane w EndPointach
    if (isGroup) {
      setSelectedSortByGroup(selectedValue);
    }
    else {
      setSelectedSortByUser(selectedValue);
    }

  }

  const handleSortDirectionChange = () => {
    if (isGroup) {
      const newSortDirectionGroup = sortDirectionActiveGroup === 1 ? 0 : 1;
      setSortDirectionActiveGroup(newSortDirectionGroup);
      refetchGroups();
    }
    else {
      const newSortDirectionUser = sortDirectionActiveUser === 1 ? 0 : 1;
      setSortDirectionActiveUser(newSortDirectionUser);
      refetchUsers();
    }
  };


  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-100 container-fluid p-3 d-flex flex-column`}>

      {/*ROW*/}
      <div className="fill row h-100 g-4 p-lg-3 p-1">
        {/*1 KOLUMNA*/}
        <div className="col-lg-3">
          {/*SIDEBAR*/}
          <div className="h-100 p-0  rounded-4">
            <motion.div className={`d-grid bg-opacity-25 bg-background rounded-4 p-4 gap-2 mx-auto`} /*style={{backdropFilter: 'blur(3px)'}}*/>
              {/*UŻYTKOWNIK SWITCHER*/}

              <motion.div
                /*className={styles.toggle}*/
                variants={container}
                className="btn border-0 user-select-none center mt-0 pt-0 m-2 p-2 text-white rounded-3"
              >
                <div className="form-check pb-2 d-flex justify-content-center form-switch">
                  <input
                    className="form-check-input w-25 opacity-100 bg-danger border-danger text-black "
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    style={{ transform: "scale(2.25) " }}
                    onClick={() => { setIsGroup(!isGroup); refetchGroups(); refetchUsers(); setPageNumberPagin(1); setPageNumberGroupPagin(1); setActiveIndexGroup(-1); setActiveIndex(-1); }}
                  ></input>
                </div>
                <motion.div className={`${isGroup ? '' : 'd-none'}`}>
                  <motion.h3 initial={{ x: "10%", opacity: 0 }} animate={{ x: isGroup ? "0%" : "10%", opacity: isGroup ? 1 : 0 }}
                    className={`${isGroup ? 'p-1 m-1' : 'd-none'} pb-0 user-select-none `}>
                    Admin Panel Groups
                  </motion.h3>
                </motion.div>
                <motion.div className={`${isGroup ? 'd-none' : ""}`}>
                  <motion.h3 initial={{ x: "10%", opacity: 0 }} animate={{ x: isGroup ? "10%" : "0%", opacity: isGroup ? 0 : 1 }}
                    className={`${isGroup ? 'd-none' : 'p-1 m-1'} pb-0 user-select-none `}>
                    Admin Panel Users
                  </motion.h3>
                </motion.div>

                <hr className='bg-white opacity-100 border border-1 border-white mb-0'></hr>

              </motion.div >

              <motion.div initial="hidden" animate="visible" variants={container} className='d-grid'>

                {/*ADD*/}
                <motion.button
                  onClick={() => { isGroup ? setShowAddGroupModal(true) : setShowAddUserModal(true) }}
                  type="button"
                  variants={itemSlide}
                  className={`${isError ? 'd-none' : 'btn shadow btn-primary m-2 p-2 text-white rounded-5 border-0'}`}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  {!isGroup ? "Add User" : "Add Group"}
                </motion.button>

                {/*EDIT*/}
                <motion.button
                  onClick=
                  {() => {
                    if (isGroup) {
                      if (GroupsList?.items[activeIndexGroup] !== undefined) {
                        setShowEditGroupModal(true);
                      }
                    } else {
                      if (UsersList?.items[activeIndex] !== undefined) {
                        setShowEditUserNameModal(true);
                      }
                    }
                  }}
                  type="button"
                  variants={itemSlide}
                  className={`${isError ? 'd-none' : 'btn shadow btn-primary m-2 p-2 text-white rounded-5 border-0'}`}
                >
                  {!isGroup ? "Edit User Name" : "Edit Group"}
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (isGroup) {
                      if (GroupsList?.items[activeIndexGroup] !== undefined) {
                        setShowEditUsersInGroupModal(true);
                      }
                    } else {
                      if (UsersList?.items[activeIndex] !== undefined) {
                        setShowEditUserPasswordModal(true);
                      }
                    }
                  }}
                  type="button"
                  variants={itemSlide}
                  className={`${isError ? 'd-none' : 'btn shadow btn-primary m-2 p-2 text-white rounded-5 border-0'}`}
                >
                  {!isGroup ? "Edit User Password" : "Edit Users In Group"}

                </motion.button>

                {/*DEL*/}
                <motion.button
                  onClick={() => {
                    if (isGroup) {
                      if (GroupsList?.items[activeIndexGroup] !== undefined) {
                        setShowRemoveGroupModal(true);
                      }
                    } else {
                      if (UsersList?.items[activeIndex] !== undefined) {
                        setShowRemoveUserModal(true);
                      }
                    }
                  }}
                  type="button"
                  variants={itemSlide}
                  className={`${isError ? 'd-none' : 'btn shadow btn-primary m-2 p-2 text-white rounded-5 border-0'}`}
                >
                  {!isGroup ? "Delete User" : "Delete Group"}
                </motion.button>

              </motion.div>
              {!isGroup ?
                isLoading
                  ?
                  <div className='m-5 align-items-center d-flex justify-content-center'>
                    <LoadingComponent />
                  </div>
                  :
                  (isError
                    ?
                    <ErrorHandler error={error} />
                    :
                    <div>
                      <AddUserModal key={`addUserModal ${showAddUserModal}`} show={showAddUserModal} setShow={setShowAddUserModal} dataSubmitted={submitAdd} />
                      {UsersList.items[activeIndex] !== undefined &&
                        (<>
                          <EditUserNameModal key={`editUserNameModal ${showEditUserNameModal}`} show={showEditUserNameModal} setShow={setShowEditUserNameModal} dataSubmitted={submitEdit} user={UsersList.items[activeIndex]} />


                          <EditUserPasswordModal key={`editUserPasswdModal ${showEditUserPasswordModal}`} show={showEditUserPasswordModal} setShow={setShowEditUserPasswordModal} dataSubmitted={submitEdit} user={UsersList.items[activeIndex]} />

                          <RemoveUserModal key={`RemUserModal ${showRemoveUserModal}`} show={showRemoveUserModal} setShow={setShowRemoveUserModal} setActiveIndex={setActiveIndex} user={UsersList.items[activeIndex]} />
                        </>)}
                    </div>
                  )
                :
                isLoading2
                  ?
                  <div className='m-5 align-items-center d-flex justify-content-center'>
                    <LoadingComponent />
                  </div>
                  :
                  (isError2
                    ?
                    <ErrorHandler error={error2} />
                    :
                    <div>
                      <AddGroupModal key={showAddGroupModal} show={showAddGroupModal} setShow={setShowAddGroupModal} dataSubmitted={submitAdd} />
                      {GroupsList.items[activeIndexGroup] !== undefined &&
                        <>
                          <EditGroupModal key={`editGroupModal ${showEditGroupModal}`} show={showEditGroupModal} setShow={setShowEditGroupModal} dataSubmitted={submitEdit} group={GroupsList.items[activeIndexGroup]} />
                          <RemoveGroupModal key={`RemoveGroupModal ${showRemoveGroupModal}`} show={showRemoveGroupModal} setShow={setShowRemoveGroupModal} setActiveIndexGroup={setActiveIndexGroup} group={GroupsList.items[activeIndexGroup]} />
                          <EditUsersInGroupModal key={`EditUsersInGroupModal ${showEditUsersInGroupModal}`} show={showEditUsersInGroupModal} setShow={setShowEditUsersInGroupModal} dataSubmitted={submitEdit} group={GroupsList.items[activeIndexGroup]} />
                        </>}
                    </div>
                  )

              }
              <div className="mt-5 mb-3" />

              {/*<div className="mb-5" />*/}
            </motion.div>
            {changesIsLoading ? <></> : changesIsError ? <ErrorHandler error={changesError} /> : moderatorChangesPending ?
              <div className='row p-0 m-4'><Link to='review' className='btn rounded-pill border border-3 border-primary btn-background p-2 text-white fs-3'>Moderator Review</Link></div>
              :
              <></>
            }
          </div>
        </div>
        {/*2 COLUMN*/}
        <motion.div className="col h-100 pb-lg-0 pb-3" variants={container}>
          <div className={`rounded-4 bg-opacity-25 bg-background h-100 d-flex flex-column `} /*style={{backdropFilter: 'blur(3px)'}}*/>

            {/* REFRESHER and SEARCHER */}
            <InputGroup className="mb-1 p-3 d-flex flex-md-row flex-column">


              <InputGroup.Text
                id="basic-addon1"
                className="p-2 btn me-2 m-0 shadow-sm rounded-3 text-white btn-secondary border-0 border-white mb-3 mb-md-0"
                onClick={() => {
                  rotateInfite();
                  if (isGroup) {
                    refetchGroups();

                  } else {
                    refetchUsers();
                  }
                  setIsRefresh(true);
                }}
              >
                <motion.div
                  initial={{ rotate: rotatePrev }}
                  animate={{ rotate: isRefresh ? rotateNext : rotatePrev }}
                  onHoverEnd={e => { setIsRefresh(false); rotateInfite(); }}>
                  <HiRefresh size={30} />
                </motion.div>


              </InputGroup.Text>
              <InputGroup.Text
                id="basic-addon1"
                className="btn p-2 me-2 shadow-sm rounded-3 text-white btn-primary border-0 border-white mb-3 mb-md-0"
                onClick={() => {
                  if (isGroup) {
                    setPageNumberGroupPagin(1);
                    refetchGroups();

                  } else {
                    setPageNumberPagin(1);
                    refetchUsers();

                  }

                  setIsSearch(true);
                  setTimeout(() => {
                    setIsSearch(false);
                  }, 500);
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.8, rotate: 0 }}
                  animate={{ scale: isSearch ? 0.8 : 1, rotate: isSearch ? -60 : 0 }}
                  transition={{ duration: 0.2137 }}
                >
                  <ImSearch size={26} />
                </motion.div>

              </InputGroup.Text>
              <div className='align-items-center flex-fill justify-content-center'>
                <Form.Control
                  value={searchingPhrase}
                  onChange={handleChangeSearch}
                  className="rounded-3 shadow-sm border-0 border-white "
                  size="lg"
                  placeholder="Search..."
                /></div>
              {!isGroup ?
                <InputGroup.Text className=' bg-transparent border-0'>
                  <select
                    defaultValue={''}
                    id="sortByUser"
                    onChange={handleChangeSortBy}
                    className="form-control rounded-0 rounded-start" aria-label="Sorter">
                    <option disabled value=''>Sort By</option>
                    <option value="FirstName">{'First Name'}</option>
                    <option value="LastName">{'Last Name'}</option>
                    <option value="Email">{'Email'}</option>
                  </select>
                  <button
                    className="btn text-white btn-primary justify-content-center align-items-center h-100 rounded-0 rounded-end d-flex m-0 p-0"
                    onClick={handleSortDirectionChange}
                  >

                    <motion.div initial={{ rotateX: 0 }}
                      animate={{ rotateX: sortDirectionActiveUser ? 0 : 180, transition: { duration: 0.13 } }}>
                      <FaSortDown size={20} />
                    </motion.div>
                  </button>
                </InputGroup.Text>
                :
                <InputGroup.Text className=' bg-transparent border-0'>
                  <select
                    id="sortByGroup"
                    onChange={handleChangeSortBy}
                    className="form-control rounded-0 rounded-start" aria-label="Sorter">
                    <option disabled selected>Sort By</option>
                    <option value="Name">{'Name'}</option>
                  </select>
                  <button
                    className="btn text-white btn-primary justify-content-center align-items-center h-100 rounded-0 rounded-end d-flex m-0 p-0"
                    onClick={handleSortDirectionChange}
                  >

                    <motion.div initial={{ rotateX: 0 }}
                      animate={{ rotateX: sortDirectionActiveGroup ? 0 : 180, transition: { duration: 0.13 } }}>
                      <FaSortDown size={20} />
                    </motion.div>

                  </button>
                </InputGroup.Text>}

            </InputGroup>

            <div
              className={`flex-fill  m-2 ${styles.admin_scroll}  `}
              style={{ overflowY: "scroll", height: "0" }}
            >
              <div className="container-fluid h-100 p-3">
                <ul className="row-lg-1 pb-1 ps-0">
                  {
                    isGroup ? (isLoading2 ? <div className='m-5 align-items-center d-flex justify-content-center'>
                      <LoadingComponent />
                    </div> : (isError2 ? <ErrorHandler error={error2} /> :
                      <>
                        {GroupsList.items.length < 1 && pageNumberGroupPagin > 1 ? (
                          <>
                            {handleSetLoadPrev(pageNumberGroupPagin)}
                          </>
                        ) :
                          <GroupList groups={GroupsList.items} activeIndex={activeIndexGroup} setActiveIndex={setActiveIndexGroup} />}
                      </>
                    )
                    )
                      :
                      (isLoading ? <div className='m-5 align-items-center d-flex justify-content-center'>
                        <LoadingComponent />
                      </div> : (isError ? <ErrorHandler error={error} /> :
                        <>
                          {UsersList.items.length < 1 && pageNumberPagin > 1 ? (
                            <>
                              {handleSetLoadPrev(pageNumberPagin)}
                            </>
                          ) :
                            <UserList users={UsersList.items} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
                        </>

                      )
                      )
                  }

                </ul>
              </div>
            </div>
            <div className='d-flex row m-0 w-100'>
              {
                isGroup ? (isLoading2 ? <div className='m-5 align-items-center d-flex justify-content-center'>
                  <></>
                </div> : (isError2 ? <ErrorHandler error={error2} /> :
                  <>
                    {(pageNumberGroupPagin > 1) ? <div onClick={() => { handleSetLoadPrev(pageNumberGroupPagin); }} className="col btn rounded-4 border-2 border btn-outline-light fw-semibold text-center m-2  align-content-center "><FaArrowLeft size={20} /></div> : <></>}
                    {(GroupsList.totalPages === pageNumberGroupPagin) ? <></> : <div onClick={() => { handleSetLoadMore(pageNumberGroupPagin); }} className="col btn rounded-4 border-2 border btn-outline-light m-2 fw-semibold text-center "><FaArrowRight size={20} /></div>}
                  </>
                )
                )
                  :
                  (isLoading ? <div className='m-5 align-items-center d-flex justify-content-center'>
                    <></>
                  </div> : (isError ? <ErrorHandler error={error} /> :
                    <>
                      {(pageNumberPagin > 1) ? <div onClick={() => { handleSetLoadPrev(pageNumberPagin); }} className="col btn rounded-4 border-2 border btn-outline-light fw-semibold text-center m-2  align-content-center "><FaArrowLeft size={20} /></div> : <></>}
                      {(UsersList.totalPages === pageNumberPagin) ? <></> : <div onClick={() => { handleSetLoadMore(pageNumberPagin); }} className="col btn rounded-4 border-2 border btn-outline-light m-2 fw-semibold text-center "><FaArrowRight size={20} /></div>}
                    </>
                  )
                  )
              }
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

