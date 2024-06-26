import React, { useState, useEffect } from 'react'
import { Container } from 'reactstrap'
import { Layout, Spin } from 'antd'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import './core-ui/app.css'
import './core-ui/buttons.css'
import Header2 from './components/header/Header2'
import Home from './pages/home/Home'
import { useFavicon } from './hooks/useFavicon'
import axios from 'axios'
import Store from './pages/Stores/Store'
import SidebarNew from './components/Sidebar2.0.js/SidebarNew'
import PaymentType from './pages/PaymentType/PaymentType'
import Preview from './pages/StoreSetting/Preview'
import Language from './pages/StoreLanguage/Language'
import LanguageSettings from './pages/StoreLanguage/LanguageSettings'
import UserAccessControl from './pages/usersandroles/UserAccessControl'
import CreateUsers from './pages/usersandroles/CreateUsers'
import CreateRoles from './pages/usersandroles/CreateRoles'
import { LoadingOutlined } from '@ant-design/icons'
import LogOut from './components/LogOut'
import util from './util/common'
import { useAuth } from 'react-oidc-context'
import StoreLimitComponent from './pages/adminPlatform/StoreLimitComponent'
import MarketplaceServices from './services/axios/MarketplaceServices'
import NewDashboard from './pages/NewDashboard/Newdashboard'
import ListCurrency from './pages/storeCurrency/ListCurrency'
import EditCurrency from './pages/storeCurrency/EditCurrency'
import MyProfile from './pages/StoreUsers/MyProfile'
import StoreSettingsLayout from './pages/StoreSetting/StoreSettingsLayout'
import PlatformAdmin from './pages/adminPlatform/PlatformAdmin'
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const getPermissionsUrl = process.env.REACT_APP_USER_PROFILE_API
const umsBaseUrl = process.env.REACT_APP_USM_BASE_URL

const { Content } = Layout
const App = () => {
    const auth = useAuth()
    const [permissionData, setPermissionData] = useState([])
    const [collapsed, setCollapsed] = useState(false)

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

    if (auth.isLoading) {
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
            <Header2 collapsed={collapsed} setCollapsed={setCollapsed} />
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
                                    <Route path='list-user-roles' element={<UserAccessControl />} />
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
        //     {/* <Footer /> */}
    )
}

export default App
