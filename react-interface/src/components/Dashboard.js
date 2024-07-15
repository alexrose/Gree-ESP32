import React, { useState, useEffect } from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-dropdown';
import Container from 'react-bootstrap/Container';
import RangeSlider from 'react-bootstrap-range-slider';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { Bars } from 'react-loader-spinner';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { AC_DIRECTION, AC_FAN_SPEED, AC_MODE } from "../constants";
import { getDefaults, setParamsOn, setParamsOff } from "../actions/actionCreators";

function Dashboard() {
    const dispatch = useDispatch();

    const defaults = useSelector(state => state.defaultsData.defaults);
    const counterRequest = useSelector(state => state.handleRequestData.counterRequest);

    const [initialized, setInitialized] = useState(false);
    const [temperature, setTemperature] = useState(16);
    const [mode, setMode] = useState('');
    const [fanSpeed, setFanSpeed] = useState('');
    const [direction, setDirection] = useState('');
    const [directionAuto, setDirectionAuto] = useState('');
    const [light, setLight] = useState('');
    const [turbo, setTurbo] = useState('');
    const [xFan, setXFan] = useState('');
    const [sleep, setSleep] = useState('');

    useEffect(() => {
        dispatch(getDefaults());
    }, []);

    useEffect(() => {
        if (!initialized && defaults.length > 0) {
            setInitialized(true);
            setTemperature(defaults[1]);
            setMode(defaults[0]);
            setFanSpeed(defaults[2]);
            setDirection(defaults[4]);
            setDirectionAuto(defaults[3]);
            setLight(defaults[5]);
            setTurbo(defaults[6]);
            setXFan(defaults[7]);
            setSleep(defaults[8]);
        }
    }, [initialized, defaults]);

    const handleDirectionChange = (data) => {
        setDirection(data.value);
        setDirectionAuto((data.value > 6 || data.value === 1) ? 1 : 0);
    };

    const handleTurnOn = () => {
        dispatch(setParamsOn({ temperature, mode, fanSpeed, direction, directionAuto, light, turbo, xFan, sleep }));
    };

    const handleTurnOff = () => {
        dispatch(setParamsOff());
    }

    return (
        <Container fluid className='p-0'>
            <Bars wrapperClass="loader" type="Bars" color="#00BFFF" visible={counterRequest > 0} />

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href='#'>
                    <img alt='' width='48' height='48' src='assets/android-chrome-192x192.png' />
                    {' Gree Remote Control '}
                </Navbar.Brand>
            </Navbar>

            <Container fluid>
                <p>&nbsp;</p>
                <form name="greeData">
                    <Row>
                        <Col>
                            <Alert variant='warning'>
                                <RangeSlider
                                    min={16}
                                    max={32}
                                    size='lg'
                                    tooltip='on'
                                    onChange={e => setTemperature(e.target.value)}
                                    tooltipLabel={(t) => `${t}°`}
                                    tooltipPlacement='top'
                                    value={temperature}
                                />

                                <Row>
                                    <Col>
                                        <label>Mode</label>
                                        <Alert variant='success'>
                                            <Dropdown
                                                name={'acMode'}
                                                options={AC_MODE}
                                                onChange={e => setMode(e.value)}
                                                value={AC_MODE.find(el => el.value === mode)}
                                                placeholder="Select mode"
                                            />

                                        </Alert>
                                    </Col>
                                    <Col>
                                        <label>Fan speed</label>
                                        <Alert variant='info'>
                                            <Dropdown
                                                name={'acFanSpeed'}
                                                options={AC_FAN_SPEED}
                                                onChange={e => setFanSpeed(e.value)}
                                                value={AC_FAN_SPEED.find(el => el.value === fanSpeed)}
                                                placeholder="Select fan speed"
                                            />
                                        </Alert>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm>
                                        <label>Direction</label>
                                        <Alert variant='danger'>
                                            <Dropdown
                                                name={'acDirection'}
                                                options={AC_DIRECTION}
                                                onChange={handleDirectionChange.bind(this)}
                                                value={AC_DIRECTION.find(el => el.value === direction)}
                                                placeholder="Select direction"
                                            />
                                        </Alert>
                                    </Col>
                                    <Col sm>
                                        <label>Options</label>
                                        <Alert variant='secondary'>
                                            <ToggleButton
                                                id='toggle-light'
                                                type='checkbox'
                                                size='sm'
                                                value={1}
                                                variant='outline-secondary'
                                                checked={!!light}
                                                onChange={e => setLight(Number(e.currentTarget.checked))}
                                                className='mr-1'>
                                                Light
                                            </ToggleButton>

                                            <ToggleButton
                                                id='toggle-turbo'
                                                type='checkbox'
                                                size='sm'
                                                value={1}
                                                variant='outline-secondary'
                                                checked={!!turbo}
                                                onChange={e => setTurbo(Number(e.currentTarget.checked))}
                                                className='mr-1'>
                                                Turbo
                                            </ToggleButton>
                                            <ToggleButton
                                                id='toggle-xfan'
                                                type='checkbox'
                                                size='sm'
                                                value={1}
                                                variant='outline-secondary'
                                                checked={!!xFan}
                                                onChange={e => setXFan(Number(e.currentTarget.checked))}
                                                className='mr-1'>
                                                XFan
                                            </ToggleButton>
                                            <ToggleButton
                                                id='toggle-sleep'
                                                type='checkbox'
                                                size='sm'
                                                value={1}
                                                variant='outline-secondary'
                                                checked={!!sleep}
                                                onChange={e => setSleep(Number(e.currentTarget.checked))}>
                                                Sleep
                                            </ToggleButton>
                                        </Alert>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm>
                                        <div className='d-grid gap-2'>
                                            <Button variant="success" className={'mb-2'} onClick={handleTurnOn}>Send command</Button>
                                        </div>
                                    </Col>
                                    <Col sm>
                                        <div className='d-grid gap-2'>
                                            <Button variant="danger" className={'mb-2'} onClick={handleTurnOff}>Turn off</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Alert>
                        </Col>
                    </Row>

                </form>
            </Container>

            <ToastContainer autoClose={2000} />
        </Container>
    );
}

export default Dashboard;