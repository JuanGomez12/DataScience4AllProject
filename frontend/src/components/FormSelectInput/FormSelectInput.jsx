import './FormSelectInput.css';
import Select from 'react-select'

const FormSelectInput = (props) => {
  return(
    <div className="formInput">
      <label>{props.label}</label>
      <Select className="selectFormInput" options={props.options} />
    </div>
  )
}

export default FormSelectInput;