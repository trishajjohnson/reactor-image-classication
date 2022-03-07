import React, { useState, useContext } from "react";
import ImageContext from "../ImageContext";
import { 
    Card,
    CardActionArea,
    CardMedia,
    Typography,
    CardContent,
    CardActions,
    FormControl,
    FormControlLabel, 
    RadioGroup,
    Radio } from '@mui/material';
import "./ImageCard.css";

/** Shows image.
 *
 * Is rendered by ImageList to show a "card" for each image.
 *
 * ImageList -> ImageCard
 */

function ImageCard({image}) {
    const [img, setImg] = useState(image);
    const { updateImage } = useContext(ImageContext);
    
    /**  handleChange
     * 
     *   async function handling when radio buttons on each individual
     *   image is clicked, updating the image classification status to true
     *   and changing isFoaming to true/false.
     * 
    */
    async function handleChange(e) {
        e.preventDefault();

        let image;

        if(e.target.closest(".radio").innerText === "Foaming") {
            image = await updateImage(img.id, "foaming");
        } else if(e.target.closest(".radio").innerText === "Not Foaming") {
            image = await updateImage(img.id, "not foaming");
        }
        setImg(image.data.image);
    }


    return (
        
        <div className="centerContent" >
            {!img.isClassified ?
                <Card id={img.id} className="img-card" sx={{maxWidth: 300, justifyContent: "center"}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            width="250"
                            height="250"
                            image={img.url}
                            alt={img.id}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Image ID: {img.id}
                            </Typography>
            
                            <Typography style={{color: "red"}} gutterBottom variant="h5" component="div">
                                !! Image needs classification !!
                            </Typography>    
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >    
                                <FormControlLabel className="radio" value="foaming" control={<Radio onChange={handleChange} />} label="Foaming" />
                                <FormControlLabel className="radio" value="not foaming" control={<Radio onChange={handleChange} />} label="Not Foaming" />      
                            </RadioGroup>
                        </FormControl>
                    </CardActions>
                </Card>
            :
                <Card id={img.id} className="img-card" sx={{maxWidth: 300, justifyContent: "center"}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            width="250"
                            height="250"
                            image={img.url}
                            alt={img.id}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Image ID: {img.id}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >   
                                {img.isFoaming ? 
                                    <>
                                        <FormControlLabel className="radio" value="foaming" control={<Radio onChange={handleChange} checked />} label="Foaming" />
                                        <FormControlLabel className="radio" value="not foaming" control={<Radio onChange={handleChange} />} label="Not Foaming" /> 
                                    </>     
                                :
                                    <>
                                        <FormControlLabel className="radio" value="foaming" control={<Radio onChange={handleChange} />} label="Foaming" />
                                        <FormControlLabel className="radio" value="not foaming" control={<Radio onChange={handleChange} checked />} label="Not Foaming" />   
                                    </>   
                                }    
                            </RadioGroup>
                        </FormControl>
                    </CardActions>
                </Card>
            }
        </div>         
        
    );
}

export default ImageCard;