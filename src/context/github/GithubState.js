import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './GithubReducer';
import {
  SEARCH_USERS, SET_LOADING, CLEAR_USERS, GET_USER, GET_REPOS
} from '../types'

let githibClientId;
let githibClientSecret;

if(process.env.NODE_ENV !=='production'){
  githibClientId =process.env.REACT_APP_GITHUB_CLIENT_ID;
  githibClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET
} else {
  githibClientId =process.env.GITHUB_CLIENT_ID;
  githibClientSecret = process.env.GITHUB_CLIENT_SECRET
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Search Users
  const searchUsers = async text => {
    setLoading();

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${githibClientId}&client_secret=${githibClientSecret}`
    );

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  };

  //Get single GitHub User
  const getUser = async username => {
    setLoading();

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${githibClientId}&client_secret=${githibClientSecret}`
    );

    dispatch({
      type: GET_USER,
      payload: res.data
    })
  };

  // Get Repos
  const getUserRepos = async username => {
    setLoading();

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githibClientId
      }&client_secret=${githibClientSecret}`
    );
    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  };

  //Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS })

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING })

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}>
      {props.children}
    </GithubContext.Provider>
  )
}

export default GithubState