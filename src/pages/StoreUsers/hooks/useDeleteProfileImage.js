import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const profileImageApi = process.env.REACT_APP_PROFILE_IMAGE_API

const useDeleteProfileImage = () => {
    const deleteProfileImage = async ({ data }) => {
        const params = { 'image-path': data }
        const response = await MarketplaceServices.remove(profileImageApi, params)
        return response
    }
    return useMutation({ mutationFn: deleteProfileImage })
}

export default useDeleteProfileImage
