import React, { useState, useEffect } from 'react';
import axios from "axios";
import ImageContext from "./ImageContext";

import { 
  Pagination,
  FormControl,
  InputLabel,
  NativeSelect
 } from '@mui/material';

import ImageList from './images/ImageList';
import './App.css';


/** App component holds functionality for the children components,
 *  ImageList and ImageCard. Utilizing useContext to pass updateImage
 *  functionality to ImageCard. Functionality calls backend routes to 
 *  get images or update DB. 
 */

function App() {
  const [images, setImages] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState();
  const [limit, setLimit] = useState();
  const [page, setPage] = useState();
  const [totalPages, setTotalPages]= useState();

  /** useEffect hook loads default "all" images, including ones classified
   *  as isFoaming = true and false, as well as those currently 
   *  unclassified.
   */

  useEffect(function loadImages() {
    async function getAllImages() {
      try {
        let images = await getImages();
        setImages(images.data.images);
        setTotalPages(Math.ceil(images.data.images.total/images.data.images.limit));
        setFilter(images.data.images.filter);
        setLimit(images.data.images.limit);
        setPage(images.data.images.page);
      } catch(e) {
        console.log(e);
      }
      
      setIsLoaded(true);
    }
    setIsLoaded(false);
    getAllImages();
  }, [])


  /** Handling of filter and limit changes */

  async function handleChangeFilter(e) {
    e.preventDefault();
    const newFilter = e.target.value;
    setFilter(newFilter);
    await getImages(page, newFilter, limit);
  }

  async function handleChangeLimit(e) {
    e.preventDefault();
    const newLimit = e.target.value;
    setLimit(newLimit);
    await getImages(page, filter, newLimit);
  }


  /** Handling of click for pagination */

  async function handleClick(e) {
      let goToPage;
      if(e.target.dataset.testid === "NavigateNextIcon") {
          goToPage = +images.page+1;
      } else if(e.target.dataset.testid === "NavigateBeforeIcon") {
          goToPage = +images.page-1;
      } else {
          goToPage = +e.target.innerText;     
      }
      await getImages(goToPage, filter, limit);
  }

  /** async functions to call backend images route to get images, based
   * on filter, page and limit, as well as update image isFoaming status 
   * from/in DB.
   */

  async function getImages(page=1, filter="all", limit=20) {
    try {
      let images = await axios.get(`http://localhost:3001/images?filter=${filter}&limit=${limit}&page=${page}`);
      setImages(images.data.images);
      setFilter(filter);
      setLimit(limit);
      setPage(page);
      setTotalPages(Math.ceil(images.data.images.total/images.data.images.limit));
      return images;
    } catch(e) {
      console.log("Errors: ", e);
      return { success: false, e }
    }
  }

  async function updateImage(id, updateMsg) {
    try {
      const result = await axios.patch("http://localhost:3001/images", {id, updateMsg});
      return result;
    } catch(e) {
      console.log("Errors: ", e);
    }
  }


  if(!isLoaded) return <p>Loading</p>


  return (
    <ImageContext.Provider value={{ updateImage }}>
      <div className="App">
        <h1>Foam Image Classification</h1>
        <div className="filters">
          <FormControl sx={{mr: 1, mb: 3, minWidth: 120}}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              filter by
            </InputLabel>
            <NativeSelect
              onChange={handleChangeFilter}
              defaultValue={'All'}
              inputProps={{
                name: 'all',
                id: 'uncontrolled-native',
              }}
            >
              <option value={'all'}>All</option>
              <option value={'foaming'}>Foaming</option>
              <option value={'not foaming'}>Not Foaming</option>
              <option value={'unclassified'}>Unclassified</option>
            </NativeSelect>
          </FormControl>
          <FormControl sx={{ mb: 3, minWidth: 120}}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              # per page
            </InputLabel>
            <NativeSelect
              onChange={handleChangeLimit}
              defaultValue={20}
              inputProps={{
                name: '20',
                id: 'uncontrolled-native',
              }}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </NativeSelect>
          </FormControl>
          
        </div>
        <div className="">
          <ImageList images={images} getImages={getImages} update={updateImage} />
        </div>
        <Pagination sx={{m: 5}} style={{display: "flex", justifyContent: "center"}} count={totalPages} page={+page} onClick={handleClick} />
      </div>
    </ImageContext.Provider>
  );
}

export default App;
