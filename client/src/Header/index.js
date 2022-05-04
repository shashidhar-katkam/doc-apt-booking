import React, { Component } from 'react';
import { Menubar } from 'primereact/menubar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RadioButton } from 'primereact/radiobutton';
import Authentication from '../session/index'
import { TieredMenu } from 'primereact/tieredmenu';
import LoadingComponent from 'src/LoadingComponent';
import './styles.scss'


const getThemes = () => {
    if (localStorage.getItem('themes')) {
        return JSON.parse(localStorage.getItem('themes'));
    } else {
        return [
            {
                name: "Light Blue",
                value: null,
                isSelected: true
            },
            {
                name: "Pink",
                value: 'pink',
                isSelected: false
            },
            {
                name: "Green",
                value: 'green',
                isSelected: false
            },
            {
                name: "Yellow",
                value: 'yellow',
                isSelected: false
            },
        ]
    }
}


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            themes: getThemes(),
            isShowChangeRole: false,
        }


    }




    onLogout() {
        localStorage.clear();
        this.props.history.push('/')
        window.location.reload();

    }



    getNavbarModules = () => {
        let ModuleMenuItems = [{
            label: 'Home',
            className: `${(window.location.pathname == '/') ? 'ma-menu-active' : 'ddd'}`,
            command: () => {
                this.props.history.push('/')
            },
        },
        {
            label: 'Appointments',
            className: `${(window.location.pathname == '/appointments') ? 'ma-menu-active' : 'ddd'}`,
            command: () => {
                this.props.history.push('/appointments')
            },
        },

        ];

        let assignedM = [];
        if (this.props.authenticated) {
            assignedM = ModuleMenuItems
        }



        console.log(assignedM)

        return assignedM;


    }

    changeTheme = (selectedTheme) => {

        const themes = this.state.themes.map((theme) => {
            if (theme.value == selectedTheme.value) {
                theme.isSelected = true;
            } else {
                theme.isSelected = false;

            }
            return theme;
        })
        this.setState({
            themes
        });



        localStorage.setItem('themes', JSON.stringify(themes));
        localStorage.setItem('data-theme', selectedTheme.value);
        document.documentElement.setAttribute('data-theme', localStorage.getItem('data-theme'));
        //  window.location.reload();
    }


    getThemes = () => {
        const { themes } = this.state;
        return <ul className='ma-p10'>{themes.map(theme => {
            return <li key={theme.name} className='ma-m10' >
                <RadioButton className="radio-inline" value={theme.value} inputId={theme.value} name="theme"
                    onChange={() => {
                        this.changeTheme(theme)
                    }}
                    checked={theme.isSelected}
                />
                <label className='ma-label-s1' htmlFor={theme.value}>{theme.name}</label>
            </li>
        })}  </ul>


    }



    render() {

        const items = [
            {
                label: 'Theme',
                icon: 'pi pi-slack',
                items: [
                    {
                        template: <>{this.getThemes()}</>
                    }
                ]
            },

            {
                separator: true
            },
            {
                label: 'Log Out',
                icon: 'pi pi-fw pi-power-off',
                command: () => { this.onLogout() }
            }
        ];

        return <div>
            <div className="ma-menubar-w">

                <div className="p-grid ma-menubar ma-no-pm">
                    <div className="p-col-12 p-md-2 ma-no-p">
                        <h2 className='app-title' onClick={() => { this.props.history.push('/') }} >Doc. Apt. Mgt. Portal</h2>
                    </div>
                    <div className="p-col-12 p-md-6 ma-no-p">
                        <Menubar model={this.getNavbarModules()}
                            className="m-menu-bar "
                        />
                    </div>
                    {
                        this.props.authenticated ? <>
                            <div className="p-col-12 p-md-4 ma-right ">
                                <div style={{ width: '40px', float: 'right' }}>
                                    <img src={this.props?.user?.user?.photo} onClick={(event) => this.menu.toggle(event)} style={{ height: '34px', borderRadius: '50%' }} />
                                </div>
                                <div style={{ marginRight: '50px' }}>
                                    <p style={{ textAlign: 'right' }} className='ma-profile'>
                                        {/* <i className='pi pi-angle-down'></i> */}
                                        {this.props?.user?.user?.name}</p>
                                </div>
                            </div>
                        </> : <>
                            <div className="p-col-12 p-md-4 ma-right ">
                                <p className='ma-right login-txt' onClick={() => { this.props.history.push('/login') }}>Login / Register</p>
                            </div>

                        </>
                    }
                </div>

                <TieredMenu model={items} popup ref={el => this.menu = el} />

                {
                    this.props.isLoading && <LoadingComponent />
                }



            </div>
            <div className='body-container'>
                {this.props.children}
            </div>
            <footer className='footer'>
                <p className='footer-p'>&copy; Doc Mgt Portal 2022</p>
                <p className='all-rights'>All rights reserved.</p>
            </footer>
        </div>
    }

}


const mapStateToProps = (state) => ({
    user: state.user,
    userType: state?.user?.userType,
    authenticated: state?.user?.authenticated,
});


export default connect(mapStateToProps, {
})(Authentication(withRouter(Header)));

