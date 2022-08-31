import {Form} from "react-bootstrap";
import React from "react";
import {pushQueryString} from "@src/helpers/query";
import {searchListings} from "@src/GlobalState/collectionSlice";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

export const SearchBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const handleSearch = debounce((event) => {
    const { value } = event.target;

    const query = currentFilter.toPageQuery();
    if (value) query.search = value;
    else delete query.search;

    pushQueryString(router, {
      slug: router.query.slug,
      ...query
    });

    dispatch(searchListings(value));
  }, 300);

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <Form.Control
      type="text"
      placeholder="Search by name"
      onChange={handleSearch}
      style={{ marginBottom: 0, marginTop: 0 }}
      defaultValue={''}
    />
  )
}