import { Container, Spinner } from 'reactstrap'

const PageSpinner = () => {
    return (
        <Container fluid className='container-custom spinner bg-[#F4F4F4]'>
            <Spinner
                role='status'
                type='border'
                color='info'
                size='lg'
            ></Spinner>
        </Container>
    )
}

export default PageSpinner
