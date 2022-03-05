import React from "react";
import ImageCard from "./ImageCard";
import "./ImageList.css";
import { Grid } from '@mui/material';


/**  Container for images.  */

function ImageList({images, updateImage}) {
    console.log("images passed to ImageList", images);

    return (
        
        <div className="">
            <Grid container>
                {images.rows.map(i => (
                    <div className="col-md-3 album-col mb-3">
                        <ImageCard key={i.id} image={i} update={updateImage} />
                    </div>
                ))}
            </Grid>
        </div>         
    );
}

export default ImageList;