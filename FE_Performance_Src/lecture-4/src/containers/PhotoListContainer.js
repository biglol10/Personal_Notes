import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import PhotoList from '../components/PhotoList';
import { fetchPhotos } from '../redux/photos';
import selectFilteredPhotos from '../redux/selector/selectFilteredPhotos';

function PhotoListContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  // 배열은 우리가 꺼내올 값들
  // photo data를 가져와서 그 결과를 리턴해주는 selector 만들기...
  // selectCreatedPhotos가 photos데이터를 가지고 있는게 아니라 이걸 useSelector안에서 사용하게 도면 photos를 가져오게 됨
  // 보통 selector폴더를 따로 만들어서 import
  // const selectFilteredPhotos = createSelector(
  //   [state => state.photos.data, state => state.category.category],
  //   (photos, category) =>
  //     category === 'all' ? photos : photos.filter(photo => photo.category === category)
  // );

  // createSelector의 결과값을 여기에 넣음
  const photos = useSelector(selectFilteredPhotos);
  const loading = useSelector(state => state.photos.loading);

  // const { category, allPhotos, loading } = useSelector(
  //   state => ({
  //     category: state.category.category,
  //     allPhotos: state.photos.data,
  //     loading: state.photos.loading,
  //   }),
  //   shallowEqual
  // );

  // const photos =
  //   category === 'all' ? allPhotos : allPhotos.filter(photo => photo.category === category);

  if (loading === 'error') {
    return <span>Error!</span>;
  }

  if (loading !== 'done') {
    return <span>loading...</span>;
  }

  return <PhotoList photos={photos} />;
}

export default PhotoListContainer;
