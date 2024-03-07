import { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/App.css'
import PostList from '../components/PostList.jsx'
import PostForm from '../components/PostForm.jsx'
import PostFilter from '../components/PostFilter.jsx'
import MyModal from '../components/UI/MyModal/MyModal.jsx'
import MyButton from '../components/UI/button/MyButton.jsx'
import { usePosts } from '../hooks/usePost.js'
import PostService from '../API/PostService.js'
import Loader from '../components/UI/Loader/Loader.jsx'
import { useFetching } from '../hooks/useFetching.js'
import { getPageCount, getPagesArray } from '../utils/pages.js'
import Pagination from '../components/UI/pagination/Pagination.jsx'
import { useObserver } from '../hooks/useObserver.js'
import MySelect from '../components/UI/select/MySelect.jsx'

function Posts() {
    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({ sort: '', query: '' })
    const [modal, setModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
    const lastElement = useRef()
    const [fetchPosts, isPostsLoading, postError] = useFetching(
        async (limit, page) => {
            const response = await PostService.getAll(limit, page)
            setPosts([...posts, ...response.data])
            const totalCount = response.headers['x-total-count']
            setTotalPages(getPageCount(totalCount, limit))
        }
    )
    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1)
    })
    useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])
    const createPost = (newPost) => {
        setPosts((prevPosts) => [...prevPosts, newPost])
        setModal(false)
    }
    //Получаем post из дочернего компонента
    const removePost = (post) => {
        console.log(post)
        setPosts(posts.filter((p) => p.id !== post.id))
    }
    const changePage = (page) => {
        setPage(page)
        fetchPosts(limit, page)
    }
    return (
        <div className="App">
            <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
                Создать пост
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost} />
            </MyModal>
            <hr style={{ margin: '15px 0' }} />
            <PostFilter filter={filter} setFilter={setFilter} />
            <MySelect
                value={limit}
                onChange={(value) => setLimit(value)}
                defaultValue="Количество элементов"
                options={[
                    { value: 5, name: '5' },
                    { value: 10, name: '10' },
                    { value: 25, name: '25' },
                    { value: -1, name: 'Показать все' },
                ]}
            />
            {postError && <h1>Произошло ошибка ${postError}</h1>}
            <PostList
                remove={removePost}
                posts={sortedAndSearchedPosts}
                title={'Посты про JS'}
            />
            <div
                ref={lastElement}
                style={{ height: 20, background: 'red' }}
            ></div>
            {isPostsLoading && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 50,
                    }}
                >
                    <Loader />
                </div>
            )}
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />
        </div>
    )
}

export default Posts
