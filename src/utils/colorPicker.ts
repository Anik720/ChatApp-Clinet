
const getColor = (char: string) => {


    switch (char) {
        case '0':
            return '#000000';
        case '1':
            return '#ffffff';
        case '2':
            return '#9d9d9d';
        case '3':
            return '#be2633';
        case '4':
            return '#e06f8b';
        case '5':
            return '#493c2b';
        case '6':
            return '#a46422';
        case '7':
            return '#eb8931';
        case '8':
            return '#f7e26b';
        case '9':
            return '#2f484e';
        case 'a':
            return '#44891a';
        case 'b':
            return '#a3ce27';
        case 'c':
            return '#1b2632';
        case 'd':
            return '#005784';
        case 'e':
            return '#31a2f2';
        case 'f':
            return '#b2dcef';
        case 'g':
            return '#7e2553';
        case 'h':
            return '#b77bba';
        case 'i':
            return "#9f9f9f";
        case 'j':
            return "#6c6c6c";
        case 'k':
            return "#424242";
        case 'l':
            return "#1f1f1f";
        case 'm':
            return "#d77355";
        case 'n':
            return "#508cd7";
        case 'o':
            return "#74c2e1";
        case 'p':
            return "#b2dcef";
        case 'q':
            return "#ffffff";
        case 'r':
            return "#d6d6d6";
        case 's':
            return "#969696";
        case 't':
            return "#5e5e5e";
        case 'u':
            return "#ac3232";
        case 'v':
            return "#d95763";
        case 'w':
            return "#d77bba";
        case 'x':
            return "#8f974a";
        case 'y':
            return "#8a6f30";
        case 'z':
            return "#d7ba7d";

        default:
            return '#000000';
    }
}

export default getColor;