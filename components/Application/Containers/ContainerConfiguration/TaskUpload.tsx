import {useState} from 'react';
import * as Globals from '../../../../Globals';

export default function TaskUpload() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append(
                'file',
                selectedFile
            );

            const xhr = new XMLHttpRequest();
            xhr.open(
                'POST',
                Globals.REST_V1_PREFIX + '/tasks',
                true
            );
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('Upload successful!');
                } else if (xhr.readyState === 4) {
                    console.error(
                        'Upload failed: ',
                        xhr.status,
                        xhr.statusText
                    );
                }
            };
            xhr.send(formData);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    return (
        <div>

            <div>
                <input type="file" onChange={handleFileChange}/>
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    )
}