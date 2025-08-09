import toast from 'react-hot-toast'

export const showToast = (message, type = 'success') => {
  toast[type](message, {
    id: 'global-toast', // prevents duplicates
  })
}