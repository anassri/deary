import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        type: "light",
        primary: {
            light: '#3EFF9A',
            main: '#33DD87',
            dark: '#33DD87',
            contrastText: '#FFF',
        },
        secondary: {
            light: '#A0A0A0',
            main: '#666666',
            dark: '#444444',
            contrastText: '#FFF',
        },
        background: {
            paper: '#FFF',
            default: '#EFEFEF'
        }
    },
})
export default theme;