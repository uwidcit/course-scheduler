import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';


import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { onValue, ref } from 'firebase/database';

/** @title Responsive sidenav */
@Component({
	selector: 'app-full-layout',
	templateUrl: 'full.component.html',
	styles: [`	
				.topbar{
					height: 8vh;
				}
				.navbar-brand{ 
				}
				.page-content{
					height: 91vh;
					padding: 0 !important;
				}
				#account_icon{
					transform: scale(2);
				}

				mat-card{
					padding: 10px 5px !important;
					/* background: #00fa04; */
					box-shadow: 4px 8px 3px 5px rgb(155 155 155 / 65%) !important;
				}

				mat-list-item {
					padding: 0px !important;
				}
				mat-card:hover{
					background: #2fa4e7;
					color: #fff;
					transform: scale(1.05);
					
				}

				

				#notice-list{
					 height: 26.4vh; /*clamp( 25vh, 15vh, 15vh); */
					 overflow-y: auto;
					 
				}
				
				.notice{
					font-size: 14px;
					margin: 0;
				}
				.notice-icon{
					font-size: 6px;
					color: #1E88E5
				}
				.date{
					font-size: 12px;
					text-align: end;
					margin: 0;
				}
				
				.center-text{
					padding: 0 25% !important;
					background: #1E88E5;
					color: #fff;
					/* bottom: -15.4vh; */
					font-size: 14px;
					height: 25px !important;
					position: sticky;
					top: 27vh;
				}

				.center-text:hover{
					background: #d0d0d0;
					color: #1E88E5;
				}
	`]
})
export class FullComponent implements OnDestroy {
	currentUser: any 
	unreadNotifications: boolean = false; 
	notifications: any = [] ;

	mobileQuery: MediaQueryList;

	dir = 'ltr';
	dark = false;
	minisidebar = false;
	boxed = false;
	horizontal = false;

	green = false;
	blue = false;
	danger = false;
	showHide = false; 
	url = '';
	sidebarOpened = false;
	status = false;

	public showSearch = false;
	public config: PerfectScrollbarConfigInterface = {};
	// tslint:disable-next-line - Disables all
	private _mobileQueryListener: () => void;

	constructor(
		public router: Router,
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		public menuItems: MenuItems,
		private auth: AuthenticationService,
		private firebase: FirebaseDBServiceService
	) {
		this.mobileQuery = media.matchMedia('(min-width: 1700px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		// tslint:disable-next-line: deprecation
		this.mobileQuery.addListener(this._mobileQueryListener);
		// this is for dark theme
		// const body = document.getElementsByTagName('body')[0];
		// body.classList.toggle('dark');
		this.dark = false;
		
		const tableRef = ref(this.firebase.dbRef, `users`);
    	onValue(tableRef, (snapshot) => {
			let result = snapshot.val()
			
			//reset unreadNotification notice on refresh
			this.unreadNotifications = false

			if( !result || !result[this.currentUser].notifications) return

			
			result[this.currentUser].notifications.forEach( (notice: { read: boolean, message: string, date: Date })=>{
				if(this.unreadNotifications == false && !notice.read )
					this.unreadNotifications = true
			})
			this.notifications = result[this.currentUser].notifications
			console.log('Notifications: ', this.notifications)
		});
	}

	ngOnDestroy(): void {
		// tslint:disable-next-line: deprecation
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}


	ngOnInit() {
		//const body = document.getElementsByTagName('body')[0];
		// body.classList.add('dark');

		if (this.auth.loggedIn){
			this.currentUser = this.auth.currentUser?.uid
			console.log(this.currentUser)
		}
		else{
			this.router.navigate(['login']);
		}
	}

	clickEvent(): void {
		 this.status = !this.status;
	}

	darkClick() {
		// const body = document.getElementsByTagName('body')[0];
		// this.dark = this.dark;
		const body = document.getElementsByTagName('body')[0];
		body.classList.toggle('dark');
		// if (this.dark)
		// else
		// 	body.classList.remove('dark');
		// this.dark = this.dark;
		// body.classList.toggle('dark');
		// this.dark = this.dark;
	}

	signOut(){
		this.auth.logout();
		this.router.navigate(['login']);  //redirect user to login
	}

	readAll(){
		this.firebase.readAllNotifications(this.currentUser)
		this.router.navigate(['views/calendar'])
	}

	clearAllNotifications(){
		this.firebase.deleteUserNotifications(this.currentUser)
		this.router.navigate(['views/calendar'])
	}	

}
