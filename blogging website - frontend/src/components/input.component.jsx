import React from 'react'

const InputBox = ({ name, type, id, placeholder, value, icon }) => {
  return (
    <div className='relative w-[100%] mb-4'>
        <input 
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            defaultValue={value}
            className='input-box'
        />
        <i className={"fi " + icon + " input-icon"}></i>

        {/* {
            type == "password" ?
            <i class="fi fi-rr-eye-crossed input-icon left-[auto] right-4 cursor-pointer"></i> :
            ""
        } */}
    </div>
  )
}

export default InputBox