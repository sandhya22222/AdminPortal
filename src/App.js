import React, { useState, useEffect, lazy } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Container } from 'reactstrap'
import { Layout, Spin } from 'antd'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import './core-ui/app.css'
import './core-ui/buttons.css'
import { useFavicon } from './hooks/useFavicon'
import axios from 'axios'
import { useAuth } from 'react-oidc-context'
import NewDashboard from './pages/NewDashboard/Newdashboard'
import MarketplaceServices from './services/axios/MarketplaceServices'
import util from './util/common'
import { LoadingOutlined } from '@ant-design/icons'

const Home = lazy(() => import('./pages/home/Home'))
const Header2 = lazy(() => import('./components/header/Header2'))
const Store = lazy(() => import('./pages/Stores/Store'))
const SidebarNew = lazy(() => import('./components/Sidebar2.0.js/SidebarNew'))
const PaymentType = lazy(() => import('./pages/PaymentType/PaymentType'))
const Preview = lazy(() => import('./pages/StoreSetting/Preview'))
const Language = lazy(() => import('./pages/StoreLanguage/Language'))
const LanguageSettings = lazy(() => import('./pages/StoreLanguage/LanguageSettings'))
const UserAccessControl2 = lazy(() => import('./pages/usersandroles/UserAccessControl2'))
const CreateUsers = lazy(() => import('./pages/usersandroles/CreateUsers'))
const CreateRoles = lazy(() => import('./pages/usersandroles/CreateRoles'))
const LogOut = lazy(() => import('./components/LogOut'))
const StoreLimitComponent = lazy(() => import('./pages/adminPlatform/StoreLimitComponent'))
const ListCurrency = lazy(() => import('./pages/storeCurrency/ListCurrency'))
const EditCurrency=lazy(()=>import('./pages/storeCurrency/EditCurrency'))
const MyProfile=lazy(()=>import('./pages/StoreUsers/MyProfile'))
const StoreSettingsLayout=lazy(()=>import('./pages/StoreSetting/StoreSettingsLayout'))
const PlatformAdmin=lazy(()=>import('./pages/adminPlatform/PlatformAdmin'))

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const getPermissionsUrl = process.env.REACT_APP_USER_PROFILE_API
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL

const { Content } = Layout
const App = () => {
    const auth = useAuth()
    const [permissionData, setPermissionData] = useState([])
    const [collapsed, setCollapsed] = useState(false)
    const [isLanguageSelected, setIsLanguageSelected] = useState(false)

    useFavicon()

    const getPermissions = () => {
        let baseurl = `${umsBaseUrl}${getPermissionsUrl}`
        MarketplaceServices.findAll(baseurl, null, false)
            .then((res) => {
                console.log('get permission api res', res)
                let realmNameClient = res.data.response_body['realm-name'] + '-client'
                util.setPermissionData(res.data.response_body.resource_access[`${realmNameClient}`].roles)
                setPermissionData(res.data.response_body.resource_access[`${realmNameClient}`].roles)
            })
            .catch((err) => {
                console.log('get permission api error', err)
            })
    }

    useEffect(() => {
        if (auth && auth.user && auth.user?.access_token) {
            getPermissions()
        }
    }, [auth])

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 54,
            }}
            spin
        />
    )

    switch (auth.activeNavigator) {
        case 'signinSilent':
            return <div></div>
        case 'signoutRedirect':
            return <></>
    }

    if (auth.isLoading || isLanguageSelected) {
        util.removePermission()
        return (
            <Layout className='h-[100vh]'>
                <Content className='grid justify-items-center align-items-center h-full'>
                    <Spin indicator={antIcon} />
                </Content>
            </Layout>
        )
    }

    if (auth.error) {
        return void auth.signoutRedirect()
    }

    return (
        <Router>
            <ToastContainer
                rtl={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? true : false}
                position={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'top-left' : 'top-right'}
            />
            <Header2 collapsed={collapsed} setCollapsed={setCollapsed} setIsLanguageSelected={setIsLanguageSelected} />
            <Container fluid className='p-0 bg-[#F4F4F4] text-[#393939]'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    
                    <Route path='/logout' element={<LogOut />} />

                    {auth.isAuthenticated ? (
                        <Route
                            path='/dashboard'
                            element={
                                <SidebarNew
                                    permissionValue={permissionData}
                                    collapsed={collapsed}
                                    setCollapsed={setCollapsed}
                                />
                            }>
                            <Route path='' element={<NewDashboard />} />
                            <>
                                <Route path='language' element={<Language />} />
                                <Route path='language/language-settings' element={<LanguageSettings />} />
                                <Route path='store' element={<Store />} />
                                <Route path='store/storesetting' element={<StoreSettingsLayout />} />
                                <Route path='currency' element={<ListCurrency />} />
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
                            </>
                        </Route>
                    ) : (
                        <>{void auth.signinRedirect()}</>
                    )}
                </Routes>
            </Container>
        </Router>
    )
}

export default App
