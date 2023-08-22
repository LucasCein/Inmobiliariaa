import { MDBBadge, MDBListGroupItem } from 'mdb-react-ui-kit';
const PropertiesItems = ({img,name,description,status}) => {
    //tomamos las props de la base de datos 
    return (
    <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        <img
                            src='https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/stock%2F8ea241e96504a398f291a31939963e8ba948368c'
                            alt=''
                            style={{ width: '100px', height: '100px',marginLeft:'10px' }}
                            className='rounded-circle'
                        />
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>John Doe</p>
                            <p className='text-muted mb-0'>john.doe@gmail.com</p>
                        </div>
                    </div>
                    <MDBBadge pill light color='success' className='me-5'>
                        Active
                    </MDBBadge>
                </MDBListGroupItem>
  )
}

export default PropertiesItems