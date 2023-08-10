import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextEditor = ({ value, placeholder, onChange }) => {
    const [text, setText] = useState(value);

    const handleChange = (value) => {
        setText(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <ReactQuill
            value={text}
            onChange={handleChange}
            modules={TextEditor.modules}
            formats={TextEditor.formats}
            placeholder={placeholder}
        />
    );
};

TextEditor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
    ],
};

TextEditor.formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
    'link', 'blockquote', 'code-block', 'align', 'color', 'background'
];

export default TextEditor;
