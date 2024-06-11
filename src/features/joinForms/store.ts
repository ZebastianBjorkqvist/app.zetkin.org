import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { findOrAddItem, remoteList, RemoteList } from 'utils/storeUtils';
import { ZetkinJoinForm, ZetkinJoinSubmission } from './types';

export interface JoinFormsStoreSlice {
  formList: RemoteList<ZetkinJoinForm>;
  submissionList: RemoteList<ZetkinJoinSubmission>;
}

const initialState: JoinFormsStoreSlice = {
  formList: remoteList(),
  submissionList: remoteList(),
};

const joinFormsSlice = createSlice({
  initialState: initialState,
  name: 'joinForms',
  reducers: {
    joinFormCreated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.loaded = new Date().toISOString();
      item.data = form;
    },
    joinFormLoad: (state, action: PayloadAction<number>) => {
      const formId = action.payload;
      const item = findOrAddItem(state.formList, formId);
      item.isLoading = true;
    },
    joinFormLoaded: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.isLoading = false;
      item.loaded = new Date().toISOString();
      item.data = form;
    },
    joinFormUpdate: (state, action: PayloadAction<[number, string[]]>) => {
      const [formId, mutating] = action.payload;
      const item = findOrAddItem(state.formList, formId);
      item.mutating = mutating;
    },
    joinFormUpdated: (state, action: PayloadAction<ZetkinJoinForm>) => {
      const form = action.payload;
      const item = findOrAddItem(state.formList, form.id);
      item.data = form;
      item.mutating = [];
    },
    joinFormsLoad: (state) => {
      state.formList.isLoading = true;
    },
    joinFormsLoaded: (state, action: PayloadAction<ZetkinJoinForm[]>) => {
      state.formList = remoteList(action.payload);
      state.formList.loaded = new Date().toISOString();
    },
    submissionsLoad: (state) => {
      state.submissionList.isLoading = true;
    },
    submissionsLoaded: (
      state,
      action: PayloadAction<ZetkinJoinSubmission[]>
    ) => {
      state.submissionList = remoteList(action.payload);
      state.submissionList.loaded = new Date().toISOString();
    },
  },
});

export default joinFormsSlice;
export const {
  joinFormCreated,
  joinFormLoad,
  joinFormLoaded,
  joinFormUpdate,
  joinFormUpdated,
  joinFormsLoad,
  joinFormsLoaded,
  submissionsLoad,
  submissionsLoaded,
} = joinFormsSlice.actions;
