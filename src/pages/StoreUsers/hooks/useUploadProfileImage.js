import { useMutation } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const profileImageApi = process.env.REACT_APP_PROFILE_IMAGE_API

const useUploadProfileImage = () => {
    const uploadProfileImage = async ({ data, imagePath }) => {
        if (imagePath) {
            const params = { 'image-path': imagePath }
            const response = await MarketplaceServices.update(profileImageApi, data, params)
            return response
        } else {
            const response = await MarketplaceServices.save(profileImageApi, data)
            return response
        }
    }
    return useMutation({ mutationFn: uploadProfileImage })
}

export default useUploadProfileImage
