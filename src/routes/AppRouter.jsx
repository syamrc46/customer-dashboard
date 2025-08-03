import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { REVIEW_EDIT, REVIEW_LISTING, LOGIN, REVIEWFROMEMAIL, UNSUBSCRIPTION, RESUBSCRIPTION } from '../routes/routes';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path={REVIEWFROMEMAIL.path} element={REVIEWFROMEMAIL.element} />
            <Route path={REVIEW_LISTING.path} element={REVIEW_LISTING.element} />
            <Route path={REVIEW_EDIT.path} element={REVIEW_EDIT.element} />
            <Route path={UNSUBSCRIPTION.path} element={UNSUBSCRIPTION.element} />
            <Route path={RESUBSCRIPTION.path} element={RESUBSCRIPTION.element} />
            <Route path={LOGIN.path} element={LOGIN.element} />
        </Routes>
    )
}
