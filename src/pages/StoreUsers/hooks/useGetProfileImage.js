import { useQuery } from '@tanstack/react-query'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
const profileImageApi = process.env.REACT_APP_PROFILE_IMAGE_API

const useGetProfileImage = (imagePath) => {
    const getProfileImage = async () => {
        const params = { absolute: true }
        const response = await MarketplaceServices.findMedia(profileImageApi, params)
        const imageUrl = URL.createObjectURL(response?.data)
        return imageUrl
    }
    return useQuery({
        queryKey: ['profile-image'],
        queryFn: getProfileImage,
        retry: false,
        enabled: !!imagePath,
        refetchOnWindowFocus: false,
    })
}

export default useGetProfileImage
