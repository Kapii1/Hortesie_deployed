import { API_URL } from "../../../url"

const fetcher =  (url, options) => {
    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            return error
        })
}

export default function useAPI(){
    const addPhotoToProject = (id, file) => {
        const data = new FormData();
        data.append("idProjet", id);
        const file_photo = file;

        for (let i = 0; i < file_photo.length; i++) {
            data.append("file", file_photo[i]);
        }

        return fetcher(API_URL + "/projects/" + id + "/add_image/", {
            method: "POST",
            body: data,
        })
    }

    const getProjectImages = (id) => {
        return fetcher(API_URL + `/projects/${id}/images/`, {
            method: "GET",
        })
    }

    const deletePhoto = (id) => {
        return fetcher(API_URL + `/images/${id}/`, {
            method: "DELETE",
        })
    }
    const setVignette = (id_projet, id_vignette) => {
        return fetcher(API_URL + `/projects/${id_projet}/`, {
            method: "PATCH",
            body: JSON.stringify({ "vignette": id_vignette }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            
        })
    }

    const saveModifyProject = (id, data) => {
        return fetcher(API_URL + `/projects/${id}/`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            
        })
    }

    return {
        addPhotoToProject,
        getProjectImages,
        deletePhoto,setVignette
    }
}