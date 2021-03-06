import React, { Component } from 'react';
import { Layout, notification, Icon } from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { receiveData,handleResponsive } from './action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Routes from './routes';
const { Content, Footer } = Layout;

class App extends Component {
    state = {
        collapsed: false,
    };
    componentWillMount() {
        const { receiveData, history } = this.props;
        const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('rem'));
        user ? receiveData(user, 'auth') : history.push('/login');

        this.getClientWidth();
        window.onresize = () => {
            // console.log('屏幕变化了');
            this.getClientWidth();
        }
    }

    componentDidMount() {
        const openNotification = () => {
            notification.open({
              message: '首次登陆',
              description: (
                  <div>
                      第一次登陆会看到这个消息。。。
                  </div>
              ),
              icon: <Icon type="info-circle" style={{ color: 'green' }} />,
              duration: 0,
              onClose: localStorage.setItem('isFirst', JSON.stringify(true))
            });
        };
        const isFirst = JSON.parse(localStorage.getItem('isFirst'));
        const user = localStorage.getItem('user') || localStorage.getItem('rem');
        (!isFirst && user) && openNotification();
    }

    getClientWidth = () => {    // 获取当前浏览器宽度并设置responsive管理响应式
        const { handleResponsive } = this.props;
        const clientWidth = document.body.clientWidth;
        handleResponsive({isMobile: clientWidth <= 992});
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { auth, responsive } = this.props;
        return (
            <Layout>
                {!responsive.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                <Layout style={{flexDirection: 'column'}}>
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
                    <Content style={{ margin: '0 16px', overflow: 'initial' }}>
                        <Routes auth={auth} />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        西安梦启成诚网络科技有限公司 ©2018
                    </Footer>
                </Layout>
                
                {
                    responsive.isMobile && (   // 手机端对滚动很慢的处理
                        <style>
                        {`
                            #root{
                                height: auto;
                                // min-height: 100%;
                            }
                        `}
                        </style>
                    )
                }
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    const { auth = {data: {}} } = state.httpData;
    const { responsive } = state;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch),
    handleResponsive: bindActionCreators(handleResponsive, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
