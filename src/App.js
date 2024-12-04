import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import './core-ui/app.css'
import './core-ui/buttons.css'
import { useFavicon } from './hooks/useFavicon'
import axios from 'axios'
import { useAuth } from 'react-oidc-context'
import { AppSidebar } from './shadcnComponents/customComponents/app-sidebar'
import { lazyWithRetry } from './components/loading/LazyRetry'
import MarketplaceServices from './services/axios/MarketplaceServices'
import util from './util/common'
import NewFooter from './components/footer/Footer' // Import your footer
import Header2 from './components/header/Header2'
import Home from './pages/home/Home'
import API_ENDPOINTS from './services/API/apis'
// Lazy load components
const NewDashboard = lazyWithRetry(() => import('./pages/NewDashboard/Newdashboard'))
const Store = lazyWithRetry(() => import('./pages/Stores/Store'))
const PaymentType = lazyWithRetry(() => import('./pages/PaymentType/PaymentType'))
const Preview = lazyWithRetry(() => import('./pages/StoreSetting/Preview'))
const Language = lazyWithRetry(() => import('./pages/StoreLanguage/Language-v2'))
const LanguageSettings = lazyWithRetry(() => import('./pages/StoreLanguage/LanguageSettings'))
const UserAccessControl2 = lazyWithRetry(() => import('./pages/usersandroles/UserAccessControl2'))
const CreateUsers = lazyWithRetry(() => import('./pages/usersandroles/CreateUsers'))
const CreateRoles = lazyWithRetry(() => import('./pages/usersandroles/CreateRoles'))
const LogOut = lazyWithRetry(() => import('./components/LogOut'))
const StoreLimitComponent = lazyWithRetry(() => import('./pages/adminPlatform/StoreLimitComponent'))
const ListCurrency = lazyWithRetry(() => import('./pages/storeCurrency/ListCurrency'))
const EditCurrency = lazyWithRetry(() => import('./pages/storeCurrency/EditCurrency'))
const MyProfile = lazyWithRetry(() => import('./pages/StoreUsers/MyProfile'))
const StoreSettingsLayout = lazyWithRetry(() => import('./pages/StoreSetting/StoreSettingsLayout'))
const PlatformAdmin = lazyWithRetry(() => import('./pages/adminPlatform/PlatformAdmin'))

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const getPermissionsUrl = API_ENDPOINTS.REACT_APP_USER_PROFILE_API
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL

// Layout component for the dashboard

const App = () => {
    const auth = useAuth()
    const [permissionData, setPermissionData] = useState([])
    const [collapsed, setCollapsed] = useState(false)
    const [isLanguageSelected, setIsLanguageSelected] = useState(false)

    useFavicon()

    const getPermissions = async () => {
        try {
            const baseurl = `${umsBaseUrl}${getPermissionsUrl}`
            const res = await MarketplaceServices.findAll(baseurl, null, false)
            const realmNameClient = res.data.response_body['realm-name'] + '-client'
            const roles = res.data.response_body.resource_access[`${realmNameClient}`].roles
            util.setPermissionData(roles)
            setPermissionData(roles)
        } catch (err) {
            console.error('get permission api error', err)
        }
    }

    useEffect(() => {
        if (auth?.user?.access_token) {
            util.setAuthToken(auth.user?.access_token)
            util.setIsAuthorized(true)
            getPermissions()
        } else {
            util.removeAuthToken()
            util.removeIsAuthorized()
        }
    }, [auth])

    // Loading states
    if (auth.activeNavigator === 'signinSilent') return <div />
    if (auth.activeNavigator === 'signoutRedirect') return null
    if (auth.isLoading || isLanguageSelected) {
        util.removePermission()
        return (
            <div className='h-screen'>
                <div className='grid place-items-center'>
                    <div className='w-14 h-14 border-4 border-gray-300 border-t-brandPrimaryColor rounded-full animate-spin'></div>
                </div>
            </div>
        )
    }
    if (auth.error) {
        return void auth.signoutRedirect()
    }

    return (
        <Router>
            <div className='flex flex-col min-h-screen'>
                <ToastContainer
                    rtl={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'}
                    position={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'top-left' : 'top-right'}
                />
                <Header2
                    className='fixed top-0 left-0 right-0 z-50'
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    setIsLanguageSelected={setIsLanguageSelected}
                />
                <React.Suspense
                    fallback={
                        <div className='grid place-items-center h-screen'>
                            <div className='w-14 h-14 border-4 border-gray-300 border-t-brandPrimaryColor rounded-full animate-spin'></div>
                        </div>
                    }>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/logout' element={<LogOut />} />

                        {auth.isAuthenticated ? (
                            <>
                                <Route
                                    path='/dashboard'
                                    element={
                                        <AppSidebar
                                            collapsed={collapsed}
                                            setCollapsed={setCollapsed}
                                            permissionData={permissionData}
                                        />
                                    }>
                                    <Route index element={<NewDashboard />} />
                                    <Route path='language' element={<Language collapsed={collapsed} />} />
                                    <Route path='language/language-settings' element={<LanguageSettings />} />
                                    <Route path='store' element={<Store permissionData={permissionData} />} />
                                    <Route path='store/storesetting' element={<StoreSettingsLayout />} />
                                    <Route path='currency' element={<ListCurrency collapsed={collapsed} />} />
                                    <Route path='currency/edit-currency' element={<EditCurrency />} />
                                    <Route path='preview' element={<Preview />} />
                                    <Route path='paymenttype' element={<PaymentType />} />
                                    <Route path='adminsettings' element={<StoreLimitComponent />} />
                                    <Route path='userprofile' element={<MyProfile />} />
                                    <Route path='platformadmin' element={<PlatformAdmin />} />
                                    <Route path='user-access-control'>
                                        <Route path='list-user-roles' element={<UserAccessControl2 />} />
                                        <Route path='add-user' element={<CreateUsers />} />
                                        <Route path='edit-user' element={<CreateUsers />} />
                                        <Route path='add-roles' element={<CreateRoles />} />
                                        <Route path='edit-roles' element={<CreateRoles />} />
                                    </Route>
                                </Route>
                                <Route path='*' element={<Navigate to='/dashboard' replace />} />
                            </>
                        ) : (
                            <Route path='*' element={<>{void auth.signinRedirect()}</>} />
                        )}
                    </Routes>
                </React.Suspense>
                <NewFooter /> {/* Add Footer here */}
            </div>
        </Router>
    )
}

export default App
