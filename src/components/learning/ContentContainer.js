import { Row, Col, Container } from 'react-bootstrap'
import { Content } from './Content'

export function ContentContainer({ node,  moderator }) {
    return (
        <>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col className='p-0'>
                        {node.childs?.map((child, index) => <Content key={index} node={child} moderator={moderator} />)}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
