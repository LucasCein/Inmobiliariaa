import {MDBListGroup} from 'mdb-react-ui-kit';
import PropertiesItems from '../PropertiesItems/PropertiesItems';
const Properties = () => {
    return (
        //aca tenemos que hacer un ciclo leyendo la base de datos para que arme la lista de todas las propiedades
        <div className='mx-auto w-75 ' style={{marginTop:'200px'}}>
            <MDBListGroup style={{ minWidth: '22rem'}} light>
                
                <PropertiesItems/>
            </MDBListGroup>
        </div>
    )
}

export default Properties