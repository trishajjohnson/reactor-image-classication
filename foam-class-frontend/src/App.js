import React, { useState, useEffect } from 'react';
import axios from "axios";
import ImageContext from "./ImageContext";
import { 
  Pagination,
  FormControl,
  InputLabel,
  Select,
  NativeSelect
 } from '@mui/material';
import ImageList from './images/ImageList';
import './App.css';

function App() {
  const [images, setImages] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [totalPages, setTotalPages]= useState();

  useEffect(function loadImages() {
    async function getAllImages() {
      try {
        let images = await axios.get("http://localhost:3001/images");
        setImages(images.data.images);
        setTotalPages(Math.ceil(images.data.images.total/images.data.images.limit));
        setFilterData({
          filter: images.data.images.filter,
          limit: images.data.images.limit,
          page: images.data.images.page
        })
      } catch(e) {
        console.log(e);
      }
      
      setIsLoaded(true);
    }
    setIsLoaded(false);
    getAllImages();
  }, [])

  async function handleChangeFilter(e) {
    e.preventDefault();
    const filter = e.target.value;
    setFilterData({
      ...filterData,
      filter: filter
    });
    console.log("filter", filter);
    console.log("filterData", filterData);
    const result = await axios.get("http://localhost:3001/images", filter);
    console.log("result after filter", result);
  }

  async function handleChangeLimit(e) {
    e.preventDefault();
    const limit = e.target.value;
    setFilterData({
      ...filterData,
      limit: limit
    });
    console.log("limit", limit);
    console.log("filterData", filterData);
    const result = await axios.get("http://localhost:3001/images", {...filterData, limit });
    console.log("result after filter", result);
  }

  async function handleClick(e) {
      let goToPage;
      if(e.target.dataset.testid === "NavigateNextIcon") {
          goToPage = images.page+1;
      } else if(e.target.dataset.testid === "NavigateBeforeIcon") {
          goToPage = images.page-1;
      } else {
          goToPage = +e.target.innerText;     
      }
      console.log("goToPage", goToPage);
      const result = await getImages(goToPage);
      console.log("result in pagination click", result);
  }

  async function getImages(page) {
    try {
      let images = await axios.get("http://localhost:3001/images", {...filterData, page: page});
      setImages(images.data.images);
      setFilterData({
        ...filterData,
        page: page
      });
      return { success: true };
    } catch(e) {
      console.log("Errors: ", e);
      return { success: false, e }
    }
  }

  async function updateImage(id, updateMsg) {
    try {
      const result = await axios.patch("http://localhost:3001/images", {id, updateMsg});
      console.log("result in updateImage App.js", result);
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
          <FormControl sx={{mr: 1, minWidth: 120}}>
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
          <FormControl sx={{minWidth: 120}}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              # per page
            </InputLabel>
            <NativeSelect
              onChange={handleChangeLimit}
              defaultValue={20}
              inputProps={{
                name: 20,
                id: 'uncontrolled-native',
              }}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </NativeSelect>
          </FormControl>
          
        </div>
        <div className="image-list">
          <ImageList images={images} getImages={getImages} update={updateImage} />
        </div>
        <Pagination style={{display: "flex", justifyContent: "center"}} count={totalPages} page={images.page} onClick={handleClick} />
      </div>
    </ImageContext.Provider>
  );
}

export default App;
