import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Card,
    Popover,
    Button,
    Avatar,
    List,
    Comment,
} from 'antd'
import {
    RetweetOutlined,
    HeartOutlined,
    HeartTwoTone,
    MessageOutlined,
    EllipsisOutlined,
} from '@ant-design/icons'
import {
    useDispatch,
    useSelector,
} from 'react-redux'
import PostImages from './PostImages'
import CommentForm from './CommentForm'
import PostCardContent from './PostCardContent'
import { REMOVE_POST_REQUEST } from '../../reducers/post'
import FollowButton from './FollowButton'

const PostCard = ({ post }) => {
    const dispath = useDispatch()

    const [liked, setLiked] = useState(false)
    const [commentForOpened, setCommentForOpened] = useState(false)

    const { me } = useSelector((state) => state.user)
    const { removePostLoading } = useSelector((state) => state.post)
    const id = me && me.id // == me?.id

    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev)
    }, [])

    const onToggleComment = useCallback(() => {
        setCommentForOpened((prev) => !prev)
    })

    const onRemovePost = useCallback(() => {
        dispath({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })
    }, [])

    return (
        <div style={{ marginBottom: 20 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" />,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="header" onClick={onToggleLike} />
                        : <HeartOutlined key="heart" onClick={onToggleLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover
                        key="more"
                        content={(
                            <Button.Group>
                                {
                                    id && post.User.id === id
                                        ? (
                                            <>
                                                <Button type="primary">수정</Button>
                                                <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                            </>
                                        )
                                        : <Button type="alert">신고</Button>
                                }
                            </Button.Group>
                        )}
                    >
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                extra={id && <FollowButton post={post} />}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}
                />
            </Card>
            {
                commentForOpened && (
                    <div>
                        <CommentForm post={post} />
                        <List
                            header={`${post.Comments.length}개의 댓글`}
                            itemLayout="horizontal"
                            dataSource={post.Comments}
                            renderItem={(item) => (
                                <li>
                                    <Comment
                                        author={item.User.nickname}
                                        avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                        content={item.content}
                                    />
                                </li>
                            )}
                        />
                    </div>
                )
            }
        </div>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
}

export default PostCard
