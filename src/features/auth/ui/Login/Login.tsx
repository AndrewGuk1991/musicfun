import {useLoginMutation} from "@/features/auth/api/authApi.ts";
import {Path} from "@/common/routing";
import s from './Login.module.css'

export const  Login = () => {
    const [login,  { isLoading: isLoginLoading }] = useLoginMutation()

    const loginHandler = () => {

        const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

        window.open(url, 'oauthPopup', 'width=500, height=600')

        const receiveMessage = async (event: MessageEvent) => {
            if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) {
                console.warn(`[OAuth] Ignored message from unauthorized origin: ${event.origin}`)
                return
            }

            const { code } = event.data
            if (!code) {
                console.warn('[OAuth] Message received, but authorization code is missing')
                return
            }

            window.removeEventListener('message', receiveMessage)
            login({ code, redirectUri, rememberMe: false })
        }

        window.addEventListener('message', receiveMessage)
    }

    return (
        <button
            className={s.buttonLogin}
            type={'button'}
            onClick={loginHandler}
            disabled={isLoginLoading}
        >
            {isLoginLoading ? 'Signing in...' : 'Sign up with APIHUB'}
        </button>
    )
}