import React, { useState, useEffect } from 'react'
import { Layout, Spin } from 'antd'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import './core-ui/app.css'
import './core-ui/buttons.css'
import { useFavicon } from './hooks/useFavicon'
import axios from 'axios'
import { useAuth } from 'react-oidc-context'
import { LoadingOutlined } from '@ant-design/icons'
import { AppSidebar } from './shadcnComponents/app-sidebar'

import MarketplaceServices from './services/axios/MarketplaceServices'
import util from './util/common'

// Lazy load components
const Home = React.lazy(() => import('./pages/home/Home'))
const NewDashboard = React.lazy(() => import('./pages/NewDashboard/Newdashboard'))
const Store = React.lazy(() => import('./pages/Stores/Store'))
const Header2 = React.lazy(() => import('./components/header/Header2'))
const PaymentType = React.lazy(() => import('./pages/PaymentType/PaymentType'))
const Preview = React.lazy(() => import('./pages/StoreSetting/Preview'))
const Language = React.lazy(() => import('./pages/StoreLanguage/Language-v2'))
const LanguageSettings = React.lazy(() => import('./pages/StoreLanguage/LanguageSettings'))
const UserAccessControl2 = React.lazy(() => import('./pages/usersandroles/UserAccessControl2'))
const CreateUsers = React.lazy(() => import('./pages/usersandroles/CreateUsers'))
const CreateRoles = React.lazy(() => import('./pages/usersandroles/CreateRoles'))
const LogOut = React.lazy(() => import('./components/LogOut'))
const StoreLimitComponent = React.lazy(() => import('./pages/adminPlatform/StoreLimitComponent'))
const ListCurrency = React.lazy(() => import('./pages/storeCurrency/ListCurrency'))
const EditCurrency = React.lazy(() => import('./pages/storeCurrency/EditCurrency'))
const MyProfile = React.lazy(() => import('./pages/StoreUsers/MyProfile'))
const StoreSettingsLayout = React.lazy(() => import('./pages/StoreSetting/StoreSettingsLayout'))
const PlatformAdmin = React.lazy(() => import('./pages/adminPlatform/PlatformAdmin'))

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const getPermissionsUrl = process.env.REACT_APP_USER_PROFILE_API
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL

const { Content } = Layout

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
            getPermissions()
        }
    }, [auth])

    // Loading states
    if (auth.activeNavigator === 'signinSilent') return <div />
    if (auth.activeNavigator === 'signoutRedirect') return null
    if (auth.isLoading || isLanguageSelected) {
        util.removePermission()
        return (
            <Layout className='h-screen'>
                <Content className='grid place-items-center'>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 54 }} spin />} />
                </Content>
            </Layout>
        )
    }
    if (auth.error) {
        return void auth.signoutRedirect()
    }

    return (
        <Router>
            <div className='flex flex-col min-h-screen '>
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
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 54 }} spin />} />
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
                                    <Route path='store' element={<Store />} />
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
            </div>
        </Router>
    )
}

export default App
