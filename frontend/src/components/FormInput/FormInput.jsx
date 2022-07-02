import './FormInput.css';

const FormInput = (props) => {
  return(
    <div className="formInput">
      <label>{props.label}</label>
      <input type={props.type} placeholder={props.placeholder}
      onChange={e=>props.changeFunction(e.target.value)}
      />
    </div>
  )
}

export default FormInput;