import React, {useEffect, useRef, useState} from 'react';


import './ImageUpload.css';
import Button from "../Button/Button";
import Text from "../../UIElement/Text/Text";


const ImageUpload = (props) => {

    const [file, setFile] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [valid, setValid] = useState(false);
    const [touched, setTouched] = useState(false);

    const filePickerRef = useRef(null);

    const acceptedImages = (dataUrl) => {
        return /^data:image\/(jpeg|png|jpg);base64,.+$/.test(dataUrl.toString())
    }

    useEffect(() =>{

        const {id, onInput} = props;
        let fileIsValid = false;
        if (file && file instanceof File) {
            const fileReader = new FileReader();
            let pickedFile;
            fileReader.onload = () => {

                const dataUrl = fileReader.result;

                if (acceptedImages(dataUrl)) {
                    setPreviewUrl(dataUrl);
                    setValid(true);
                    fileIsValid = true;
                    pickedFile = file;
                } else {
                    setPreviewUrl('');
                    setValid(false);
                    pickedFile = '';
                }

                onInput(id, pickedFile, fileIsValid);


            }

            fileReader.readAsDataURL(file);
        }

    }, [file, setPreviewUrl, setValid])

    const pickedImageHandler = (event) => {
        event.preventDefault();
        //console.log(event.target.value);
        setTouched(true);

        let pickedFile;
        if (event.target.files && event.target.files.length > 0) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
        }

    }

    const pickImageHandler = (event) => {
        event.preventDefault();
        filePickerRef.current.click();
    }

    return (
        <div className="form-control">
            <input id={props.id}
                   style={{display: 'none'}}
                   type="file"
                   accept=".jpg,.jpeg,.png"
                   ref={filePickerRef}
                   onChange={pickedImageHandler}
            />
            <div className={`image-upload ${props.center ? 'center' : ''}`}>
                <div className="image-upload__preview">
                    { previewUrl && valid && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && !touched &&
                    <Text center
                          bold
                          size="md"
                    >
                        Please pick an image!
                    </Text>}
                    {!previewUrl && touched && !valid &&
                    <Text center
                          bold
                          danger
                          size="md"
                    >
                        Please pick a valid image!
                    </Text>}
                </div>

                <Button onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
        </div>
    )

}




export default ImageUpload;
