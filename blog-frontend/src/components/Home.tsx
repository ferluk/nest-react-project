import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import auth0Client from '../utils/auth';


interface IState {
  data: any[];
}

export class Home extends React.Component<{} & RouteComponentProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = { data: [] }
  }

  public async componentDidMount(): Promise<any> {
    const response = await fetch('/blog/posts');
    const json = await response.json();
    this.setState({ data: json })
  }

  public async deletePost(id: string) {
    await fetch(`/blog/delete?postID=${id}`, {
      method: "delete",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "authorization": `Bearer ${auth0Client.getIdToken()}`
      })
    });
    this._removePostFromView(id);
    this.props.history.push('/');
  }

  private _removePostFromView(id: string): void {
    const index = this.state.data.findIndex(post => post._id === id);
    this.state.data.splice(index, 1);
  }

  public render() {
    return (
      <div className={'page-wrapper'}>
        <div className="row">
          {this.state.data && this.state.data.map(post => (
            <div className="col-md-4" key={post._id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h2 className="card-img-top">{post.title} {process.env.BASE_URL} </h2>
                  <p className="card-text">{post.body}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      {
                        auth0Client.isAuthenticated() && (auth0Client.getProfile().nickname === post.author) &&
                        <Link to={`edit/${post._id}`} className="btn btn-sm btn-outline-secondary">Edit Post </Link>
                      }

                      <Link to={`post/${post._id}`} className="btn btn-sm btn-outline-secondary">View Post </Link>
                      {
                        auth0Client.isAuthenticated() && (auth0Client.getProfile().nickname === post.author) &&
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => this.deletePost(post._id)}>Delete Post</button>
                      }
                    </div>
                  </div>

                  <div className="card-footer">
                    <small className="text-muted">by: {post.author}</small>
                  </div>

                </div>
              </div >
            </div >
          ))}
        </div >
      </div >
    )
  }
}
