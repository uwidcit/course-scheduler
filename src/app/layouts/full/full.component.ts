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
import {FormControl, Validators} from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseDBServiceService } from 'src/app/services/firebase-dbservice.service';
import { onValue, ref } from 'firebase/database';
import { HotToastService } from '@ngneat/hot-toast';

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
				mat-card:hover {
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

				.profile-panel{
					width: 40vw;
				}

				.profile-panel-container{
					padding: 15px;
					
				}

				.profile-panel-container h4, .profile-panel-container button{
					text-align: center
				}

				.form_buttons{
					margin-top: min(35px, 5vh);
					display: flex;
					flex-direction: row;
					justify-content: space-evenly;
				}

				

				#update_button{
					background:  #2fa4e7;
					color: #fff;
					padding: 10px 5px;
					transition: 0.3s;
					text-transform: uppercase;
				}

				#update_button:hover{
					background: #fff;
					color:  #2fa4e7;
					
					transform: scale(1.05);
					box-shadow: 0px -8px 15px 3px rgb(155 155 155 / 65%) !important;
				}

				#cancel_button{
					background: #fff;
					color:  #2fa4e7;
					transition: 0.3s;
					text-transform: uppercase;
				}

				#cancel_button:hover{
					background:  #2fa4e7;
					color: #fff;
					box-shadow: 0px -8px 15px 3px rgb(155 155 155 / 65%) !important;
				}
				



				@media (max-width: 600px){
					.profile-panel{
						width: 100vw;

					}
					.profile-panel-container{
						display: flex;
						flex-direction: column;
						justify-content: center;
					}
				}
	`]
})
export class FullComponent implements OnDestroy {
	currentUser: any 
	isAdmin : boolean = false
	email = new FormControl('', [Validators.required, Validators.email]);

	name: string = ''
	newEmail: string = ''
	hasNewPassword: boolean = false
	newPassword: string = ''
	hidePassword: boolean = true

	closeAccNav =  true

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
		private firebase: FirebaseDBServiceService,
		private toast: HotToastService 
	) { 
		
		this.mobileQuery = media.matchMedia('(min-width: 1700px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		// tslint:disable-next-line: deprecation
		this.mobileQuery.addListener(this._mobileQueryListener);
		// this is for dark theme
		// const body = document.getElementsByTagName('body')[0];
		// body.classList.toggle('dark');
		this.dark = false;

		if (this.auth.loggedIn){
			this.currentUser = this.auth.currentUser?.uid 
			this.newEmail = this.auth.currentUser?.email || ''
			//check if the current user is an admin
			//this.isAdmin = this.auth.isAdmin
			// this.firebase.isAdmin(this.currentUser).subscribe((response)=>{
			// 	if(response.result)
			// 		this.isAdmin = response.result
			// 	// else if(response.error)
			// 	// 	console.log(response.error)
			// })
			// console.log(this.currentUser)
		}
		else{
			this.router.navigate(['login']);
		}
		
		const tableRef = ref(this.firebase.dbRef, `users`);
    	onValue(tableRef, (snapshot) => {
			let result = snapshot.val()
			
			//reset unreadNotification notice on refresh
			this.unreadNotifications = false

			console.log('Current USER Data: ', result[`${this.currentUser}`] )
			if( result[`${this.currentUser}`] && result[`${this.currentUser}`].account_type){
				this.name = result[`${this.currentUser}`].name || ''
				//this.newEmail =result[`${this.currentUser}`].email
				this.isAdmin = result[`${this.currentUser}`].account_type
			}
			if( !result || !result[this.currentUser] ||  !result[this.currentUser].notifications){ 
				this.notifications = []
				return
			}

			console.log("Checking for notifications for: ", this.currentUser)
			
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
		this.auth.logout().subscribe(()=>{
			if(!this.auth.loggedIn)
				this.router.navigate(['login']);  //redirect user to login
		});
		
	}

	readAll(){
		this.firebase.readAllNotifications(this.currentUser)
		
	}

	clearAllNotifications(){
		this.firebase.deleteUserNotifications(this.currentUser)
		
	}	

	getErrorMessage() {
		if (this.email.hasError('required')) {
		  return 'You must enter a value';
		}
	
		return this.email.hasError('email') ? 'Not a valid email' : '';
	  }
	
	  updateAcc(){
		  if(this.name == '' || this.newEmail == '')
		  	this.toast.error('Please ensure name & email fields are filled!')
		  else if ( this.email.hasError('required') || this.email.hasError('email') )
		  	this.toast.error('Cannot submit an Invalid Email!')
		  else if( this.hasNewPassword && this.newPassword == '')
		  	this.toast.error('Please enter a password or uncheck new Password!')
		  else {
			  let userData = {
				  userIdentifier: this.currentUser,
				  name: this.name,
				  email: this.newEmail,
				  account_type : this.isAdmin ? 'Admin' : 'User',
				  hasNewPassword: this.hasNewPassword,   //true/ false 
				  password: this.hasNewPassword ? this.newPassword : ''
			  }
			  
			  //console.log('New Account Data', JSON.stringify(userData))
			  this.firebase.editMyAccount(userData).subscribe((response)=>{
				if(response.error)  
					this.toast.error(response.error)
				else
					this.toast.success(response.message)
			  })

		  }
	  }

	  
}
