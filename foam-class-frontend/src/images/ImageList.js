import React from "react";
import ImageCard from "./ImageCard";
import "./ImageList.css";
import { Grid } from '@mui/material';


/**  Container for images.  */

function ImageList({images, updateImage}) {

    return (
        
            <Grid container justifyContent="center" spacing={2}>
                {images.rows.map(i => (
                    <Grid item md={3}>
                        <ImageCard key={i.id} image={i} update={updateImage} />
                    </Grid>
                ))}
            </Grid>
    );
}

export default ImageList;