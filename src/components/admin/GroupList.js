import { useState, useEffect } from "react"
import styles from "./BoardAdmin.module.css";
import { FiInfo } from "react-icons/fi";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { getGroup } from "../../network/lib/group";
import { useQuery } from "@tanstack/react-query";
import { ErrorHandler } from "../common/ErrorHandler";
import { motion } from "framer-motion";
import { QuickModal } from "../common/QuickModal"
const itemSlide = {
  hidden: { y: "5%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
  },
};

const container = {
  visible: {
    opacity: 1, y: "0%",
    transition: {
      duration: 1.5,
      delayChildren: 0.15,
      staggerChildren: 0.15,
      ease: "easeOut",
    }
  },
  hidden: { opacity: 0, y: "5%" },
};


export function GroupList({ groups, activeIndex, setActiveIndex }) {
    const [showDetailsIndex, setShowDetailsIndex] = useState(-1);
    //const [activeIndex, setActiveIndex] = useState(-1)
    




    return (
      <motion.div initial="hidden" animate="visible" variants={container} >
            {groups.map((item, index) => {
                const isActive = (index === activeIndex)
                return (
                    <motion.div variants={itemSlide}
                        onClick={() => setActiveIndex(index)}
                        className={`container-fluid mb-3 p-3 bg-light bg-gradient rounded m-0 border-2 border border-dark shadow-sm ${isActive ? styles.active : styles.inactive}`} key={index} style={{ overflowX: "auto" }}>
                        <div className="row align-items-center">
                            <div className="col-md-2 d-flex justify-content-center">
                                <div className="btn btn-background d-flex align-content-center justify-content-center" onClick={() => setShowDetailsIndex(index)} >
                                    <FiInfo className="me-1 d-flex align-items-center justify-content-center text-white" size={24} />
                                    Details
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="h-100 flex-fill d-flex p-1">
                                    <div className="container m-1 g-1">
                                        <div className="row align-items-center">
                                            <div className="fw-bold col p-0 d-flex justify-content-md-end text-start">
                                                NAME:
                                            </div>
                                            <div className="col h6 mb-0 d-flex justify-content-md-end">
                                                {(item.name === null) ? '---' : item.name}
                                            </div>
                                        </div>
                                        <div className="row align-items-center">
                                            <div className="fw-bold col p-0 d-flex justify-content-md-end text-start">
                                                EXPIRATION DATE:
                                            </div>
                                            <div className="col h6 mb-0 d-flex justify-content-md-end">
                                                {item.expirationDate ?? 'No expiration date'}
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="h-100 flex-fill d-flex p-1">
                                    <div className="container m-1 g-1">

                                        <div className="row align-items-center">
                                            <div className="fw-bold col p-0 d-flex justify-content-md-center text-start">
                                                ROLES:
                                            </div>
                                            <div className="col   p-0 h6 mb-0 d-flex justify-content-md-start text-start">
                                              <div className="row ms-sm-0 ms-1">
                                                <div className="col  form-check form-check-inline">
                                                    <label className="form-check-label m-0" htmlFor="inlineCheckbox3">
                                                        User
                                                    </label>
                                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value="option2" checked={item.isUser} disabled />
                                                </div>
                                                <div className="col form-check form-check-inline">
                                                    <label className="form-check-label m-0" htmlFor="inlineCheckbox1">
                                                        Mod
                                                    </label>
                                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" checked={item.isModerator} disabled />
                                                </div>
                                                <div className="col  form-check form-check-inline">
                                                    <label className="form-check-label m-0" htmlFor="inlineCheckbox3">
                                                        Admin
                                                    </label>
                                                    <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value="option2" checked={item.isAdmin} disabled />
                                                </div>
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
            {groups[showDetailsIndex] !== undefined &&
                <GroupDetailsModal show={groups[showDetailsIndex] !== undefined} setShow={() => setShowDetailsIndex(undefined)} group={groups[showDetailsIndex]} />
            }
        </motion.div>
    )
}

function GroupDetailsModal({ show, setShow, group }) {

    const { data: GroupInfo , isLoading, isError, error, refetch: refetchGroups } = useQuery(['group'], () => getGroup(group.id,{
        searchPhrase: '',
        pageNumber: 1,
        pageSize: 30,
        sortBy: null,
        sortDirection: 1}))
        useEffect (()=> {
          refetchGroups();
        },[refetchGroups]);
    return (
      <QuickModal
        className="modal-dialog-scrollable modal-dialog-centered"
        show={show}
        setShow={setShow}
      >
        <Modal.Header closeButton>
          <Modal.Title>Group Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-1">
            <Form.Label className="fw-bold  ">
              Name:
              <div className="fw-normal">{group.name}</div>
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className="fw-bold  ">
              Expiration Date:
              <div className="fw-normal">{group.expirationDate ?? "No expiration date"}</div>
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className="fw-bold">Roles:</Form.Label>
            <div className="p-1 rounded checkbox-form">
              <div className={`form-check ${styles.form_check}`}>
                <input
                  className={`form-check-input ${styles.form_check_input} `}
                  type="checkbox"
                  readOnly
                  checked={group.isUser}
                  value={group.isUser}
                  id="flexCheckDefault-1"
                />
                <label
                  className=" m-0 form-check-label"
                  htmlFor="flexCheckDefault-1"
                >
                  User
                </label>
              </div>
            </div>
            <div className="p-1 rounded checkbox-form">
              <div className={`form-check ${styles.form_check}`}>
                <input
                  className={`form-check-input ${styles.form_check_input} `}
                  type="checkbox"
                  readOnly
                  checked={group.isModerator}
                  value={group.isModerator}
                  id="flexCheckDefault-1"
                />
                <label
                  className=" m-0 form-check-label"
                  htmlFor="flexCheckDefault-1"
                >
                  Moderator
                </label>
              </div>
            </div>
            <div className="p-1 rounded checkbox-form">
              <div className={`form-check ${styles.form_check}`}>
                <input
                  className={`form-check-input ${styles.form_check_input}`}
                  type="checkbox"
                  readOnly
                  checked={group.isAdmin}
                  value={group.isAdmin}
                  id="flexCheckDefault-1"
                />
                <label
                  className=" m-0 form-check-label"
                  htmlFor="flexCheckDefault-1"
                >
                  Admin
                </label>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className="fw-bold  ">
              Description:
              {isLoading ? (
									<Spinner className='m-4 text-primary' />
								) : isError ? (
									<ErrorHandler error={error} />
								) : 
								(<div className="fw-normal">{GroupInfo.description}</div>)}
            </Form.Label>
          </Form.Group>

          
          <Form.Group className="mb-1">
            <Form.Label className="fw-bold  ">
              User Count:
              {isLoading ? (
									<Spinner className='m-4 text-primary' />
								) : isError ? (
									<ErrorHandler error={error} />
								) : 
								(<div className="fw-normal">{GroupInfo.usersCount}</div>)}
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label className="fw-bold  ">
              Users:
              <div className="fw-normal">
                {isLoading ? (
                  <Spinner className="m-4 text-primary" />
                ) : isError ? (
                  <ErrorHandler error={error} />
                ) : (
                  <div className="flex-row row mx-1" style={{wordBreak: "keep-all"}}>

                  {GroupInfo.users.map( (item,index) => {

                    return (

                      <Col key={index} className=" me-1 my-1 rounded p-1 text-white bg-primary">
                        <Row className="mx-1">{item.firstName}  {item.lastName}</Row>
                        <Row className="mx-1">{item.email}</Row>
                      </Col>
                    )
                  })
                  }
                  </div>
                )}
              </div>
            </Form.Label>
          </Form.Group>

         
        </Modal.Body>
      </QuickModal>
    );
}