import Vue from 'vue'
import Router from 'vue-router'
import Admin from './../Admin'
import Home from './../Home'
import Test from './../Test'
import Test2 from './../Test2'
//import Home2 from './../Home2'
import Login from '@/components/auth/Login'

import VideoChat from '@/components/video_chat/VideoChat'

import F_ArticlesList from '@/components/articles/FrontList'
import ArticlesList from '@/components/articles/List'
import Article from '@/components/articles/Article'
import ViewArticle from '@/components/articles/View'
import EditArticle from '@/components/articles/Edit'

import EventsList from '@/components/events/List'
import Event from '@/components/events/Event'

import RolesList from '@/components/roles/List'
import Role from '@/components/roles/Role'
import EditRole from '@/components/roles/EditRole'

import UsersList from '@/components/users/List'
import User from '@/components/users/User'
import EditUser from '@/components/users/EditUser'

import MailsList from '@/components/mails/List'
import Mail from '@/components/mails/Mail'

import NewslettersList from '@/components/newsletters/List'
import Newsletter from '@/components/newsletters/Newsletter'
import EditNewsletter from '@/components/newsletters/EditNewsletter'

import Chat from '@/components/chat/Chat'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            components: {
                default: Home,
                chat: Chat,
                b: Test2
            },
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: Login
                }
            ]
        },
        {
            path: '/video-chat',
            name: 'VideoChat',
            component: VideoChat
        },
        // {
        //     path: '/home2',
        //     name: 'Home2',
        //     component: Home2
        // },
        {
            path: '/articles',
            name: 'F_ArticlesList',
            component: F_ArticlesList
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            children: [
                {
                    path: '/cp/articles',
                    name: 'ArticlesList',
                    component: ArticlesList
                },
                {
                    path: '/cp/articles/create',
                    name: 'CreateArticle',
                    component: Article
                },
                {
                    path: '/cp/articles/:id',
                    name: 'ViewArticle',
                    component: ViewArticle
                },
                {
                    path: '/cp/articles/edit/:id',
                    name: 'EditArticle',
                    component: EditArticle
                },
                {
                    path: '/events',
                    name: 'EventsList',
                    component: EventsList
                },
                {
                    path: '/events/create',
                    name: 'CreateEvent',
                    component: Event
                },
                {
                    path: '/events/:id',
                    name: 'EditEvent',
                    component: Event
                },
                {
                    path: '/mails',
                    name: 'MailsList',
                    component: MailsList
                },
                {
                    path: '/mails/send',
                    name: 'SendMail',
                    component: Mail
                },
                {
                    path: '/mails/:id',
                    name: 'ViewMail',
                    component: Mail
                },
                {
                    path: '/cp/roles',
                    name: 'RolesList',
                    component: RolesList
                },
                {
                    path: '/cp/roles/create',
                    name: 'CreateRole',
                    component: Role
                },
                {
                    path: '/cp/roles/edit/:id',
                    name: 'EditRole',
                    component: EditRole
                },
                {
                    path: '/cp/users',
                    name: 'UsersList',
                    component: UsersList
                },
                {
                    path: '/cp/users/create',
                    name: 'CreateUser',
                    component: User
                },
                {
                    path: '/cp/users/:id',
                    name: 'ViewUser',
                    component: User
                },
                {
                    path: '/cp/users/edit/:id',
                    name: 'EditUser',
                    component: EditUser
                },
                {
                    path: '/newsletters',
                    name: 'NewslettersList',
                    component: NewslettersList
                },
                {
                    path: '/newsletters/send',
                    name: 'SendNewsletter',
                    component: Newsletter
                },
                {
                    path: '/newsletters/:id',
                    name: 'ViewNewsletter',
                    component: Newsletter
                },
                {
                    path: '/newsletters/edit/:id',
                    name: 'EditNewsletter',
                    component: EditNewsletter
                }
            ]
        }
    ]
})
